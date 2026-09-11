/**
 * Dono do carrinho de quem ainda não entrou. Os carrinhos das contas usam o
 * id do usuário; o do visitante, esta chave. É o mesmo valor que o cliente
 * usa como escopo das consultas e do socket (`GUEST_SCOPE`).
 */
export const GUEST_OWNER = 'guest'
