import React from "react";
import DynamicInputs from "../molecules/DynamicInputs"; 
import DynamicTexts from "../molecules/DynamicTexts"; 
import Button from "../atoms/Button"; 

// Agregamos la prop 'loading'
function Forms({ content = [], className = "p-4", form, handleChange, handleSubmit, loading = false }) {
    return (
        <form onSubmit={handleSubmit} className={className}>
            {content.map((item, index) => {
                const key = item.name || index; // Aseguramos una key única

                if (item.type === "text") {
                    return <DynamicTexts key={key} Texts={item.text} />;
                }
                
                if(item.type === "button") {
                    return (
                        <div key={key} className="d-grid gap-2 mb-3">
                           <Button
                             // Permite sobrescribir el variant, o usa 'primary' por defecto
                             variant={item.variant || "primary"} 
                             type="submit" 
                             disabled={loading || item.disabled} // Se deshabilita si está cargando
                           >
                              {loading ? "Cargando..." : item.text} {/* Muestra el estado de carga */}
                           </Button>
                        </div>
                    );
                }
                
                if(item.type === "inputs") {
                    return <DynamicInputs 
                                key={key} 
                                Inputs={item.inputs} 
                                form={form}
                                handleChange={handleChange} 
                            />;
                }
                
                return null;
            })}
        </form>
    );
}

export default Forms;