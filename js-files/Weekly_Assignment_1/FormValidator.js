// 2. Custom Form Validator
// Write a function that validates an object like:
// { name: "John", email: "", age: 17 }
// Validation rules:
// ● Name is required
// ● email must not be empty and should be a valid email
// ● age must be over 18

const data = {
    name: "John  Doe",
    email: "abcd@@gmail.com",
    phone: "1234567890",
    age: 51,
    password: "password123",
};

export function validateForm(formData) {
    const regularExpression=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;  //for email validation

    switch (true) {
        case formData === undefined || formData === null:
            return "Form data is required";

        case !formData.name || formData.name === "":
            return "Name is required";

        case formData.name.length < 3:
            return "Name must be at least 3 characters long";

        case !formData.email || formData.email === "":
            return "Email is required";

        case !regularExpression.test(formData.email):
            return "Email is invalid";

        case !formData.phone || formData.phone === "":
            return "Phone number is required";

        case formData.phone.length !== 10:
            return "Phone number must be exactly 10 digits long";

        case isNaN(formData.phone):
            return "Phone number must be a number";

        case !formData.age || formData.age === "":
            return "Age is required";

        case isNaN(formData.age):
            return "Age must be a number";

        case formData.age < 18:
            return "Age must be at least 18 years old";

        case !formData.password || formData.password === "":
            return "Password is required";

        case formData.password.length < 6:
            return "Password should be more than 6 characters";

        default:
            return "Form is valid";
    }
}

console.log(validateForm(data));

