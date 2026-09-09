export function formatRatingLabel(count: number) {
  return count === 1
    ? '1 avaliação de colecionador'
    : `${count} avaliações de colecionadores`
}
