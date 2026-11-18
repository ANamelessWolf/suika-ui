# Instrucciones iniciales

Tanto la documentación y los archivos readme y comentarios serán en ingles.

## Objetivo

Crear una librería de UI, que se pueda usar como un node_module, que se pueda publicar en los paquetes de node, para que se use con npm install suika-ui. Usará como base Angular Material UI https://material.angular.dev. La componentes deben cubrir los principios de UI/UX, y ser responsivos, por lo que al diseñarlos se deberan revisar para que se usen en distintos estilos, esos los definiremos despues, pero se deberán tener componentes layouts para componentes Desktop landscape, Desktop Half, Desktop Quarter, Mobile Landsacape, Mobile Portrait.

La librería será para angular, los controles serán Responsive Design with Signals, la librería incluira los modelos que alimentan a estos componentes.

No comiences a desarrollar componentes. Mejor crea un agente que pueda crear los componentes, y la documentación.

## Estructura del proyecto

En un proyecto se tendrá la librería donde se crearan los componentes, y en otra un proyecto una webapp en angular que actuará como pagina de guía de diseño para cada componente. Ahi se tendrá un ejemplo con codigo de como usarla, con mock data y se podrá visualizar en el diseño de los distintos dispositivos. Para eso crear un archivo de configuración para docker, que se compatible angular 20+ Para la guia de diseño usa un estilo de UI/UX moderno y atractivo.