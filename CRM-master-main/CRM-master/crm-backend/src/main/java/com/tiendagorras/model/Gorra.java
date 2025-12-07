package com.tiendagorras.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonProperty; // ⬅️ ¡IMPORTANTE!

@Entity
@Data 
public class Gorra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1. Mapeo de nombres de campos: Java (nombre) -> JSON (name)
    @JsonProperty("name")
    private String nombre; 
    
    private String marca;
    
    private String color; // Ya coincide (color)
    
    // 2. Mapeo de precio: Java (precio) -> JSON (price)
    @JsonProperty("price")
    private Double precio; 
    
    private Integer stock;
    
    // 3. Mapeo de imagen: Java (imagenUrl) -> JSON (imageUrl)
    @JsonProperty("imageUrl")
    private String imagenUrl; 

    // 4. Campos FALTANTES requeridos por el Frontend:
    // Los campos 'type', 'typeName', 'emoji' y 'description' deben existir en el JSON.
    // Como no están en tu DB, los crearemos como Geters calculados para el JSON.

    @JsonProperty("type")
    public String getType() {
        // Lógica simple para derivar el tipo de gorra basado en la marca o nombre si es posible,
        // Si no, asignamos un valor por defecto.
        if (nombre != null && nombre.toLowerCase().contains("plana")) return "planas";
        return "normales"; 
    }

    @JsonProperty("typeName")
    public String getTypeName() {
        if (getType().equals("planas")) return "Planas";
        return "Normales";
    }

    @JsonProperty("emoji")
    public String getEmoji() {
        // Asignar un emoji basado en el tipo o color.
        if (getType().equals("planas")) return "😎";
        return "🧢";
    }

    @JsonProperty("description")
    public String getDescription() {
        // Generar una descripción simple o usar la marca.
        return "Estilo " + getTypeName() + ", marca " + marca + ". Calidad premium.";
    }

    @JsonProperty("colorName")
    public String getColorName() {
        // Simplemente capitalizamos el nombre del color
        if (color == null || color.isEmpty()) return "Desconocido";
        return color.substring(0, 1).toUpperCase() + color.substring(1).toLowerCase();
    }
}