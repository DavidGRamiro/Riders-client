
/** Convierte en horas y minutos dados una cantidad de segundos */
export function formatTime( time: number){
  const totalMinutes = Math.round(time / 60);                                                                                                                                       
  const hours = Math.floor(totalMinutes / 60);                                                                                                                                                                                      
  const minutes = totalMinutes % 60;
  return `${hours} horas y ${minutes} minutos`
}