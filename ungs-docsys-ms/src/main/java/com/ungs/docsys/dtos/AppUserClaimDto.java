package com.ungs.docsys.dtos;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AppUserClaimDto {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String passwordHash;
    private IdentificationTypeResponseDto identificationType;
    private String identificationNumber;
    private String cuilCuit;
    private String phone;
    private LocalDate birthDate;
    private NationalityResponseDto nationality;
    private List<String> roles;
    private List<String> permissions;
   
}

