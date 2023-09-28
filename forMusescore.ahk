; Hotkey para Alt + M
!m::
    ; Crear un mapa de notas a teclas
    Notas := {"do":"c", "doS":"c{Up}", "re":"d", "reS":"d{Up}", "mi":"e", "fa":"f", "faS":"f{Up}", "sol":"g", "solS":"g{Up}", "la":"a", "laS":"a{Up}", "si":"b"}

    ; Leer el contenido del portapapeles
    clipContent := Clipboard

    ; Intentar extraer las notas del contenido del portapapeles
    notasArray := []
    try {
        ; Remover los corchetes y dividir el contenido por comas
        notasArray := StrSplit(StrReplace(StrReplace(clipContent, "[", ""), "]", ""), ",", "`n")
    } catch {
        MsgBox, El contenido del portapapeles no es un array de JavaScript válido.
        return
    }

    ; Iterar a través de las notas extraídas
    for index, nota in notasArray {
        ; Limpiar espacios en blanco y quitar comillas simples y dobles de la nota
        nota := Trim(Trim(Trim(nota, "`"" "), "'"))
        
        ; Verificar si la nota está en el mapa de notas
        if Notas.HasKey(nota) {
            ; Enviar la tecla correspondiente
            SendInput, % Notas[nota]
        } else {
            MsgBox, % "Nota no reconocida: " nota
        }
    }
return