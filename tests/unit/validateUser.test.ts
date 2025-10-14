import { de } from 'zod/v4/locales';
import { createUserSchema } from '../../src/models/user';
import { validate } from '../../src/middleware/validate.middleware';


const validUser = {
    name: "Garry Ledwith",
    phonenumber: "0871234567",
    email: "garry@student.atu.ie",
    role: "student",
    dob: "2000/01/12"
};

describe('Email Validation', () =>  {
    it('should pass for the following valid data', () => {
        expect(() => createUserSchema.parse(validUser)).not.toThrow();
    });

    it('should fail for invalid email format', () => {
        expect(() => createUserSchema.parse(
            { ...validUser, email: 'garry.ledwithgmail.com' })).toThrow();
    });
});



