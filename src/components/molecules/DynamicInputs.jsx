import React from "react";
import Input from "../atoms/Input"; 
import InputFile from "../atoms/InputFile"; 

function DynamicInputs({ Inputs = [], className = "", form, handleChange }) {
    const currentForm = form || {};
    
    return (
        <>
            {Inputs.map((input, index) => {
                const inputName = input.name || index;
                const value = currentForm[inputName] || '';
                
                // 1. Manejo especial para TextArea
                if (input.type === "textarea") {
                    return (
                        <div key={inputName} className={`mb-3 ${className}`}>
                            <label htmlFor={inputName} className="form-label">{input.label || inputName}</label>
                            <textarea 
                                name={inputName} 
                                placeholder={input.placeholder} 
                                value={value} 
                                onChange={handleChange} 
                                required={input.required}
                                disabled={input.disabled} 
                                className={`form-control ${input.className}`} 
                            />
                        </div>
                    );
                }

                // 2. Manejo especial para InputFile
                if (input.type === "file") {
                    return (
                        <div key={inputName} className={`mb-3 ${className}`}>
                            <label htmlFor={inputName} className="form-label">{input.label || inputName}</label>
                            <InputFile
                                name={inputName}
                                onChange={handleChange} 
                                disabled={input.disabled}
                            />
                        </div>
                    );
                }

                // 3. Renderizado por defecto (Input normal)
                return (
                    <div key={inputName} className={`mb-3 ${className}`}>
                        <label htmlFor={inputName} className="form-label">{input.label || inputName}</label>
                        <Input 
                            type={input.type || "text"} 
                            name={inputName} 
                            placeholder={input.placeholder} 
                            value={value} 
                            onChange={handleChange} 
                            required={input.required}
                            autoComplete={input.autoComplete} 
                            disabled={input.disabled} 
                            className={input.className}
                        />
                    </div>
                );
            })}
        </>
    );
}

export default DynamicInputs;