export default function validate(settings) {
    let isValid = { valid: true, message: '' };
    if (settings.required && !settings.value) {
        isValid = { valid: false, message: 'required fields are missing' };
    }
    if (settings.minLength &&
        typeof settings.value === 'string' &&
        settings.value.trim().length < settings.minLength) {
        isValid = { valid: false, message: 'input too short' };
    }
    if (settings.maxLength &&
        typeof settings.value === 'string' &&
        settings.value.trim().length > settings.maxLength) {
        isValid = { valid: false, message: 'input too long' };
    }
    if (settings.min &&
        typeof settings.value === 'number' &&
        settings.value < settings.min) {
        isValid = {
            valid: false,
            message: `minimal value ${settings.min} yours ${settings.value}`,
        };
    }
    if (settings.max &&
        typeof settings.value === 'number' &&
        settings.value > settings.max) {
        isValid = {
            valid: false,
            message: `maximal value ${settings.max} yours ${settings.value}`,
        };
    }
    console.log(isValid.message);
    return isValid;
}
