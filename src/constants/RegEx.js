const RegEx = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    passwordRegex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    notEmpty: /.+/
};


export { RegEx }