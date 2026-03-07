---

# 🧩 **Resumen funcional — Guía práctica de mantenimiento**

El Hero está compuesto por **un componente principal (`SectionHero`)** y **tres subcomponentes** que organizan sus partes internas.  
Cada uno controla un área visual específica de la sección, de modo que puedas **modificar o reemplazar fácilmente solo la parte que necesites**.

---

## 🟠 **1️⃣ SectionHero.jsx → Componente principal del bloque Hero**

📍 **Ubicación:** `src/components/SectionHero/SectionHero.jsx`  
🎯 **Función:** Estructura toda la sección principal del sitio (títulos, textos, botón y fila de características).

---

### 🔧 **Qué controla visualmente**
- 📝 El **título principal** (“Impresión Profesional”)  
- 💬 El **subtítulo** (“Al alcance de un clic”)  
- 📄 El **texto descriptivo** (párrafo “Sube tu archivo…”)  
- 🟠 El **botón principal (CTA)**  
- 🔷 La **fila de características** (íconos y textos inferiores)

---

### 🧠 **Qué hace internamente**
- Define el contenido textual (**título**, **subtítulo** y **descripción**).  
- Llama al componente **`HeroCTA`** para mostrar el botón de acción.  
- Crea un arreglo de objetos `features` con los íconos y textos de las tres características.  
- Llama al componente **`HeroFeaturesRow`**, que se encarga de mostrarlas visualmente.

---

### ✏️ **Qué modificar aquí**
- 🪶 Textos principales del Hero (título, subtítulo o descripción).  
- 🧩 Lista de características (`features`) si querés cambiar íconos, nombres o cantidad.  
- 🔗 El destino (`href`) del botón o el texto del mismo.  

---

## 🟢 **2️⃣ HeroCTA.jsx → Botón principal de acción (Call To Action)**

📍 **Ubicación:** `src/components/SectionHero/HeroCTA/HeroCTA.jsx`  
🎯 **Función:** Renderiza el botón **“Comenzar a imprimir”**.

---

### 🔧 **Qué controla visualmente**
- 🟠 El **botón principal del Hero** (color naranja con ícono de impresora).

---

### 🧠 **Qué hace internamente**
- Recibe tres props desde `SectionHero.jsx`:  
  - `href`: el enlace donde redirige al hacer clic.  
  - `label`: el texto visible del botón.  
  - `icon`: el ícono SVG que aparece a la izquierda del texto.  
- Aplica el estilo definido en **`HeroCTA.css`** para mantener la identidad visual.

---

### ✏️ **Qué modificar aquí**
- 🎨 El color, tamaño o forma del botón → editar **`HeroCTA.css`**.  
- ✍️ El texto, destino o ícono del botón → modificar las props dentro de **`SectionHero.jsx`**.  

📁 **CSS asociado:** `HeroCTA.css`

---

## 🔵 **3️⃣ HeroFeaturesRow.jsx → Fila que agrupa las características del servicio**

📍 **Ubicación:** `src/components/SectionHero/HeroFeaturesRow/HeroFeaturesRow.jsx`  
🎯 **Función:** Mostrar las tres características principales (**Entrega rápida**, **Calidad garantizada**, **Envíos a domicilio**).

---

### 🔧 **Qué controla visualmente**
- 🔷 La **fila de íconos con textos** que aparece debajo del botón principal.

---

### 🧠 **Qué hace internamente**
- Recibe del componente padre (**`SectionHero`**) un array `features` con los datos de cada característica.  
- Recorre ese array y muestra un componente **`HeroFeature`** por cada elemento.  
- Gestiona la estructura de lista accesible (`role="list"`).

---

### ✏️ **Qué modificar aquí**
- 📏 Si querés cambiar la **disposición o el espaciado** entre íconos → editar **`HeroFeaturesRow.css`**.  
- ➕ Si querés **agregar o quitar una característica** → editar el array `features` dentro de **`SectionHero.jsx`**.  

📁 **CSS asociado:** `HeroFeaturesRow.css`

---

## 🟣 **4️⃣ HeroFeature.jsx → Elemento individual de la fila de características**

📍 **Ubicación:** `src/components/SectionHero/HeroFeature/HeroFeature.jsx`  
🎯 **Función:** Mostrar un solo ítem de característica (ícono + texto).

---

### 🔧 **Qué controla visualmente**
- Cada **bloque vertical** con un ícono y su texto debajo  
  (por ejemplo: el reloj, el sello de calidad o el camión de envío).

---

### 🧠 **Qué hace internamente**
- Recibe dos props:  
  - `icon`: el SVG a mostrar.  
  - `text`: el texto de la característica.  
- Aplica el diseño vertical (**ícono arriba, texto abajo**) definido en **`HeroFeature.css`**.

---

### ✏️ **Qué modificar aquí**
- 🎨 El tamaño de los íconos o el color → editar **`HeroFeature.css`**.  
- 🧱 El orden entre ícono y texto → modificar el JSX dentro de **`HeroFeature.jsx`**.  

📁 **CSS asociado:** `HeroFeature.css`

---

