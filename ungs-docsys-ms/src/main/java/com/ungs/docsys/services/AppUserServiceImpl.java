package com.ungs.docsys.services;

import com.ungs.docsys.dtos.AppUserClaimDto;
import com.ungs.docsys.dtos.AppUserRequestDto;
import com.ungs.docsys.dtos.AppUserResponseDto;
import com.ungs.docsys.dtos.AppUserSignInResponseDto;
import com.ungs.docsys.exception.BusinessException;
import com.ungs.docsys.mappers.AppUserMapper;
import com.ungs.docsys.repositories.AppUserRepository;
import com.ungs.docsys.security.AppUserDetails;
import com.ungs.docsys.security.JwtUtil;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AppUserServiceImpl implements AppUserService {

    private final AppUserRepository appUserRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final AppUserMapper appUserMapper;

    @Override
    public AppUserSignInResponseDto singIn(AppUserRequestDto request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
        final AppUserClaimDto appUserClaimDto = ((AppUserDetails) userDetails).getUser();
        return new AppUserSignInResponseDto(jwtUtil.generateTokenV2(appUserClaimDto));
    }

    @Override
    public AppUserResponseDto getByUsername(String username) {
        return appUserRepository.findAppUserByEmailAndActiveIsTrue(username)
                .map(appUserMapper::toResponse)
                .orElseThrow(() -> new BusinessException(HttpStatus.NOT_FOUND, "User not found"));
    }
}
