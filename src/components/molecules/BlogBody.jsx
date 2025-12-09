function BlogBody({ titulo, autor, fecha, contenido }) {
 return (
   <>
     <Text variant="h5">{titulo}</Text>
     <Text variant="p">{autor}</Text>
     <Text variant="p">{fecha}</Text>
     <Text variant="p">{contenido}</Text>
   </>
 );
}


export default BlogBody;