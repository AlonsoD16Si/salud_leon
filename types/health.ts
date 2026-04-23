export type Campana = {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin: string;
  cobertura: number;
};

export type Noticia = {
  id: string;
  titulo: string;
  categoria: string;
  fecha: string;
  resumen: string;
};

export type ModuloAtencion = {
  id: string;
  nombre: string;
  colonia: string;
  zona: string;
  direccion: string;
  telefono: string;
  horario: string;
  coordenadas_lat: number;
  coordenadas_lng: number;
  google_maps_embed_url: string;
};

export type HistorialMedico = {
  fecha: string;
  medico: string;
  especialidad: string;
  diagnostico: string;
  notas: string;
};

export type ResultadoLaboratorio = {
  nombre_estudio: string;
  fecha: string;
  resultado: string | number;
  unidad: string;
  rango_normal: string;
  estado: "Normal" | "Elevado" | "Bajo";
};

export type UsuarioMock = {
  id: string;
  nombre: string;
  curp: string;
  nss: string;
  edad: number;
  sexo: "Masculino" | "Femenino";
  tipo_sangre: string;
  alergias: string[];
  ultima_consulta: string;
  antecedentes: {
    padecimientos_cronicos: string[];
    cirugias: string[];
    historial_familiar: string[];
  };
  historial_medico: HistorialMedico[];
  resultados_laboratorio: ResultadoLaboratorio[];
};
