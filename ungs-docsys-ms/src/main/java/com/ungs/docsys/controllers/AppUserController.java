package com.ungs.docsys.controllers;

import com.ungs.docsys.dtos.AppUserRequestDto;
import com.ungs.docsys.dtos.AppUserResponseDto;
import com.ungs.docsys.services.AppUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/users")
@AllArgsConstructor
public class AppUserController {

    private final AppUserService appUserService;

    @Operation(summary = "Sign In")
    @ApiResponse(responseCode = "201", description = "Successfully signed in")
    @ApiResponse(responseCode = "400", description = "Invalid input data")
    @PostMapping("/signIn")
    public ResponseEntity<AppUserResponseDto> signIn(@RequestBody @Valid AppUserRequestDto request) {
        AppUserResponseDto appUserResponseDto = appUserService.singIn(request);
        return ResponseEntity.status(HttpStatus.OK).body(appUserResponseDto);
    }
}
