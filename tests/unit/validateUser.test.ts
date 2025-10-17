import { de } from 'zod/v4/locales';
import { createUserSchema } from '../../src/models/user';

// Sample valid user data for testing
const validUser = {
    name: "Garry Ledwith",
    phonenumber: "0871234567",
    email: "garry@student.atu.ie",
    role: "student",
    dob: "2000/01/12"
};

// Unit tests for email validation based on user role
describe('Email Validation', () =>  {
    it('should pass for the following valid data', () => {
        expect(() => createUserSchema.parse(validUser)).not.toThrow();
    });

    it('should fail for invalid email format', () => {
        expect(() => createUserSchema.parse(
            { ...validUser, email: 'garry.ledwithgmail.com' })).toThrow();
    });
});

// Unit tests for phone number validation
describe('Phone Number Validation', () => {
    it('should pass for valid Irish phone number', () => {
        expect(() => createUserSchema.parse(validUser)).not.toThrow();
    });

    it('should fail for phone number with letters', () => {
        expect(() => createUserSchema.parse(
            { ...validUser, phonenumber: '08712ABCD' })).toThrow();
    });

    it('should fail for phone number with incorrect length', () => {
        expect(() => createUserSchema.parse(
            { ...validUser, phonenumber: '0871234' })).toThrow();
    });
});

// Unit tests for name validation
describe('Name Validation', () => {
    it('should pass for valid name', () => {
        expect(() => createUserSchema.parse(validUser)).not.toThrow();
    });

    it('should fail for empty name', () => {
        expect(() => createUserSchema.parse(
            { ...validUser, name: '' })).toThrow();
    });

    it('should fail for name with invalid characters', () => {
        expect(() => createUserSchema.parse(
            { ...validUser, name: 'Garry123' })).toThrow();
    });
});

// Unit tests for date of birth validation
