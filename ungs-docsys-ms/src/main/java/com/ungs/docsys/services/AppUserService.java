package com.ungs.docsys.services;

import com.ungs.docsys.dtos.AppUserRequestDto;
import com.ungs.docsys.dtos.AppUserResponseDto;
import com.ungs.docsys.dtos.AppUserSignInResponseDto;

import java.util.List;

public interface AppUserService {
    AppUserSignInResponseDto singIn(AppUserRequestDto request);
    AppUserResponseDto getByUsername(String username);
    List<AppUserResponseDto> getAllUsers();
}
