import Auth from '&routes/auth';
import Convocatoria from '&routes/convocatoria';
import Actas from '&routes/actas';

const auth = Auth.init();
const convocatoria = Convocatoria.init();
const actas = Actas.init();

export default [ auth.Route, convocatoria.Route, actas.Route ];