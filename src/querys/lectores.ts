export function obtenerTodoLectoresQuery(): string {
    return `
        SELECT * FROM lectores;
    `;
}