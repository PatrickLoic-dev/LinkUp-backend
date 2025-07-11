import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class RegisterDto {
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsOptional({ message: "Phone number is required" })
    phoneNumber: string;

    @IsNotEmpty({ message: "Password is required" })
    @IsString()
    password: string;
}