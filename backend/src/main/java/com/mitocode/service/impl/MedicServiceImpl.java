package com.mitocode.service.impl;

import com.mitocode.model.Medic;
import com.mitocode.repo.IGenericRepo;
import com.mitocode.repo.IMedicRepo;
import com.mitocode.service.IMedicService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MedicServiceImpl extends CRUDImpl<Medic, Integer> implements IMedicService {

    private static final String IMAGE_PREFIX = "image/";

    private final IMedicRepo repo;
    private final RestClient restClient = RestClient.create();

    @Value("${app.supabase.url}")
    private String supabaseUrl;

    @Value("${app.supabase.service-role-key}")
    private String supabaseServiceRoleKey;

    @Value("${app.supabase.bucket}")
    private String supabaseBucket;

    @Value("${app.supabase.max-photo-size}")
    private long maxPhotoSize;

    @Override
    protected IGenericRepo<Medic, Integer> getRepo() {
        return repo;
    }

    @Override
    public Medic save(Medic medic, MultipartFile file) throws Exception {
        //La foto se sube antes de persistir, asi el create sigue siendo un solo insert
        if (file != null && !file.isEmpty()) {
            medic.setPhotoUrl(uploadPhoto(file));
        }

        return save(medic);
    }

    @Override
    public Medic update(Integer id, Medic medic, MultipartFile file) throws Exception {
        //Sin archivo se conserva la url que viaja en el DTO y no se borra nada
        if (file == null || file.isEmpty()) {
            return update(id, medic);
        }

        //La url anterior se lee de la base, el medico que llega ya trae la nueva
        String previousPhotoUrl = repo.findById(id).map(Medic::getPhotoUrl).orElse(null);

        //La validacion del archivo ocurre aqui, antes de borrar nada
        medic.setPhotoUrl(uploadPhoto(file));

        Medic updated = update(id, medic);

        //La foto reemplazada se borra recien cuando el medico ya quedo guardado
        deletePhoto(previousPhotoUrl);

        return updated;
    }

    //Sube el archivo al bucket publico de Supabase Storage y devuelve la url publica
    private String uploadPhoto(MultipartFile file) {
        String contentType = file.getContentType();

        if (contentType == null || !contentType.toLowerCase().startsWith(IMAGE_PREFIX)) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "ONLY IMAGE FILES ARE ALLOWED");
        }

        if (file.getSize() > maxPhotoSize) {
            throw new ResponseStatusException(HttpStatus.CONTENT_TOO_LARGE, "MAX PHOTO SIZE EXCEEDED: " + maxPhotoSize + " BYTES");
        }

        MediaType mediaType = MediaType.parseMediaType(contentType);

        //medics/{uuid}.{ext}, sin idMedic para poder subir antes de persistir
        String objectName = "medics/" + UUID.randomUUID() + "." + resolveExtension(file, mediaType);

        try {
            restClient.post()
                    .uri(supabaseUrl + "/storage/v1/object/" + supabaseBucket + "/" + objectName)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseServiceRoleKey)
                    .contentType(mediaType)
                    .body(file.getBytes())
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientResponseException e) {
            throw new IllegalStateException("PHOTO UPLOAD FAILED: " + e.getResponseBodyAsString(), e);
        } catch (IOException e) {
            throw new IllegalStateException("PHOTO COULD NOT BE READ: " + e.getMessage(), e);
        }

        return publicUrlPrefix() + objectName;
    }

    //Borra del bucket el objeto de la foto reemplazada
    private void deletePhoto(String photoUrl) {
        String publicUrlPrefix = publicUrlPrefix();

        //Sin foto previa, o con una url fuera del bucket, no hay nada que borrar
        if (!StringUtils.hasText(photoUrl) || !photoUrl.startsWith(publicUrlPrefix)) {
            return;
        }

        String objectName = photoUrl.substring(publicUrlPrefix.length());

        if (!StringUtils.hasText(objectName)) {
            return;
        }

        try {
            restClient.delete()
                    .uri(supabaseUrl + "/storage/v1/object/" + supabaseBucket + "/" + objectName)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + supabaseServiceRoleKey)
                    .retrieve()
                    .toBodilessEntity();
        } catch (RestClientException e) {
            //El medico ya quedo guardado, el borrado fallido solo se registra
            log.warn("PHOTO DELETE FAILED: {}", photoUrl, e);
        }
    }

    private String publicUrlPrefix() {
        return supabaseUrl + "/storage/v1/object/public/" + supabaseBucket + "/";
    }

    private String resolveExtension(MultipartFile file, MediaType mediaType) {
        String extension = StringUtils.getFilenameExtension(file.getOriginalFilename());

        if (StringUtils.hasText(extension)) {
            return extension.toLowerCase();
        }

        //Sin nombre de archivo se usa el subtipo del content type: image/png -> png
        return mediaType.getSubtype().toLowerCase();
    }

    @Override
    public List<Medic> findByFullName(String fullName) {
        return repo.findByFirstNameOrLastNameContainsIgnoreCase(fullName, fullName);
    }
}
