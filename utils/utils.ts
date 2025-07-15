type ValidationRule = {
  required?: boolean;
  regex?: RegExp;
  minLength?: number;
  maxLength?: number;
  matchField?: string;
  customMessage?: string;
};

type ValidationSchema = {
  [key: string]: ValidationRule;
};

type FormErrors = {
  [key: string]: string;
};

export const validateForm = (
  formData: { [key: string]: string },
  schema: ValidationSchema
): FormErrors => {
  const errors: FormErrors = {};

  Object.entries(schema).forEach(([field, rules]) => {
    const value = formData[field]?.trim() || '';

    if (rules.required && !value) {
      errors[field] = rules.customMessage || `${field} is required`;
      return;
    }

    if (rules.minLength && value.length < rules.minLength) {
      errors[field] =
        rules.customMessage ||
        `${field} must be at least ${rules.minLength} characters`;
      return;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      errors[field] =
        rules.customMessage ||
        `${field} must be at most ${rules.maxLength} characters`;
      return;
    }

    if (rules.regex && value && !rules.regex.test(value)) {
      errors[field] =
        rules.customMessage || `${field} is invalid format`;
      return;
    }

    if (rules.matchField && value !== formData[rules.matchField]) {
      errors[field] =
        rules.customMessage || `${field} does not match ${rules.matchField}`;
      return;
    }
  });

  return errors;
};



export const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} min ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  }
}
