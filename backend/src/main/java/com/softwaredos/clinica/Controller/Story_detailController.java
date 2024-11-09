package com.softwaredos.clinica.Controller;

import java.util.*;

import com.softwaredos.clinica.config.ApiExternal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.web.bind.annotation.RestController;

import com.softwaredos.clinica.Model.Person;
import com.softwaredos.clinica.Model.Story_detail;
import com.softwaredos.clinica.Repository.PersonRepository;
import com.softwaredos.clinica.Repository.Story_detailRepository;
import com.softwaredos.clinica.Request.DetailRequest;
import com.softwaredos.clinica.config.Auth;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.web.client.RestTemplate;

@RestController
public class Story_detailController {
    private final Logger LOGGER = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private RestTemplate restTemplate;
    @Autowired
    private Story_detailRepository story_detailRepository;
    @Autowired
    private PersonRepository personRepository;
    @Autowired
    private Auth auth;

    // Como doctor quiero crear historias de pacientes
    @MutationMapping
    public Story_detail store_StoryDetail(@Argument DetailRequest request) {

        Person person = personRepository.findById(request.getPaciente_id()).get();
        try {
            Story_detail story_detail = Story_detail.builder()
                    .title(request.getTitle())
                    .data_time(new Date())
                    .notes(request.getNotes())
                    .doctor(auth.persona())
                    .paciente(person)
                    .build();

            Story_detail story_detail_saved = story_detailRepository.save(story_detail);

            try {
                //Datos para enviar en el POST
                Map<String, String> postData = new HashMap<>();
                postData.put("id", story_detail_saved.getId()); // Suponiendo
                postData.put("title", story_detail_saved.getTitle());
                postData.put("notes", story_detail_saved.getNotes());

                restTemplate.postForObject(ApiExternal.urlStoreTreatment, postData, String.class);
            } catch (Exception e) {
                LOGGER.info("error: ", e);
            }
            // return story_detailRepository.save(story_detail);
            return story_detail_saved;
        } catch (Exception e) {
            LOGGER.info("error: ", e);
            return null;
        }

    }

    // Como doctor debo poder ver el detalle del historial para ediltar
    @QueryMapping
    public Story_detail show_Story_detail(@Argument String id) {
        return story_detailRepository.findById(id).get();
    }

    // como doctor puedo editar el detalle de historial
    @MutationMapping
    public Story_detail update_StoryDetail(@Argument DetailRequest request) {
        Optional<Story_detail> optionalDetail = story_detailRepository.findById(request.getId());
        if (optionalDetail.isPresent()) {
            Story_detail story_detail = optionalDetail.get();
            story_detail.setTitle(request.getTitle());
            story_detail.setNotes(request.getNotes());
            return story_detailRepository.save(story_detail);
        } else {
            throw new EntityNotFoundException("Available_time not found with ID: " + request.getId());
        }
    }

    // Como doctor puedo listar las historia de mi paciente poniendo id paciente
    @QueryMapping
    public List<Story_detail> ListDetallePaciente(@Argument String paciente_id) {
        if (personRepository.existsById(paciente_id)) {
            return story_detailRepository.findByPaciente(personRepository.findById(paciente_id).get());
        } else {
            return null;
        }

    }

    // Como Paciente quiero listar mis detalle de historia
    @QueryMapping
    public List<Story_detail> miHistorial() {
        return story_detailRepository.findByPaciente(auth.persona());
    }

    // Opcional # como doctor puedo elimnar un detalle de historia
    @MutationMapping
    public boolean DeleteStoryDetail(@Argument String id) {
        if (story_detailRepository.existsById(id)) {
            story_detailRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }
}
