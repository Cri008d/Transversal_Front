function Input({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    required,
    autoComplete,
    disabled,
    className
}){
    return (
        <input
            type={type}
            name = {name}
            value= {value}
            onChange= {onChange}
            placeholder = {placeholder}
            required = {required}
            autoComplete = {autoComplete}
            disabled = {disabled}
            className={'form-control ${className || ""}'}
        />
    );

}
export default Input;