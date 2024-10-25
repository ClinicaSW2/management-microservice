package com.softwaredos.clinica.Repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.softwaredos.clinica.Model.Person;

@Repository
public interface PersonRepository extends MongoRepository<Person, String> {
     Person findByUser_id(String user_id);

     List<Person> findBytipoUserNot(Short tipoUser);

}