package org.web4.vallidation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.web4.annotation.PasswordMatches;
import org.web4.load.request.SignupReq;

import java.util.Locale;

public class PasswordMatchesValidator implements ConstraintValidator<PasswordMatches, Object> {

    @Override
    public void initialize(PasswordMatches constraintAnnotation) {

    }

    @Override
    public boolean isValid(Object o, ConstraintValidatorContext constraintValidatorContext) {
        SignupReq signupReq = (SignupReq) o;
        return signupReq.getPassword().equals(signupReq.getConfirmPassword());
    }
}
