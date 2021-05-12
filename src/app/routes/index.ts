import Auth from '@routes/auth';
import Convocatoria from '@routes/convocatoria';

const auth = Auth.init();
const convocatoria = Convocatoria.init();

export default [ auth.Route, convocatoria.Route ];