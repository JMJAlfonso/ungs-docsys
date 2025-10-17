import axios from "axios";
import { SignUpRequestDto } from "../dtos/sign-up-request.dto";
import { SignUpResponseDto } from "../dtos/sign-up-response.dto";
import { AppUserExtendedResponseDto } from "../dtos/app-user-extended-response.dto";

export class UserService {
    private static apiUrl = import.meta.env.VITE_DOCSYS_BFF_URL;

    public static async getUsers(): Promise<AppUserExtendedResponseDto> {
        try {
            const response = await axios.get<AppUserExtendedResponseDto>(`${this.apiUrl}/api/users`);
            return response.data;
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw error;
        }
    }
}