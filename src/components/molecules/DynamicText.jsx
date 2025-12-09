import React from 'react';
import Text from '../atoms/Text'; 

function DynamicTexts({ Texts = [] }) {
    return (
        <>
            {Texts.map((textItem, index) => (
                <Text 
                    key={index} 
                    variant={textItem.variant || 'p'} 
                    className={textItem.className}
                >
                    {textItem.content}
                </Text>
            ))}
        </>
    );
}
export default DynamicTexts;