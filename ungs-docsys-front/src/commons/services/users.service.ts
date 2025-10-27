import axios from "axios";
import { HttpUtilsService } from "../utils/http-utils.service";
import { AppUserClaimDto } from "../dtos/user-claim.dto";

export class UsersService {
    private static apiUrl = import.meta.env.VITE_DOCSYS_BFF_URL;

    public static async getAll(): Promise<AppUserClaimDto[]> {
        try {
        const response = await axios.get<AppUserClaimDto[]>(
            `${this.apiUrl}/v1/users`,
            HttpUtilsService.getAuthHeaders()
        );
        return response.data;
        } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw error;
        }
    }

    public static async getById(id: number): Promise<AppUserClaimDto> {
        try {
        const response = await axios.get<AppUserClaimDto>(
            `${this.apiUrl}/v1/users/${id}`,
            HttpUtilsService.getAuthHeaders()
        );
        return response.data;
        } catch (error) {
        console.error("Error al obtener usuario:", error);
        throw error;
        }
    }
}