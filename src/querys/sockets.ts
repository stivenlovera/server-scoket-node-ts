export function obtenerSocketQuery(): string {
    /*
        (
            SELECT  CONCAT('cliente-',authenticacion.authenticacion_id) as nombre_worker
                FROM
            web_socket
                INNER JOIN web_socket_client on web_socket_client.web_socket_id = web_socket.web_socket_id
                INNER JOIN authenticacion on authenticacion.authenticacion_id = web_socket_client.authenticacion_id
        ) UNION ALL
    */
    return `
        (
            SELECT CONCAT('worker-',web_socket_worker.sucursal_id) as nombre_worker
                FROM
                web_socket
                INNER JOIN web_socket_worker on web_socket_worker.web_socket_id = web_socket.web_socket_id
                INNER JOIN sucursal on sucursal.sucursal_id = web_socket_worker.sucursal_id
        )UNION ALL
        (
            SELECT 'server' as nombre_worker
        )UNION ALL
        (
            SELECT 'web' as nombre_worker
        )
    `;
}