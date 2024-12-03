//import { tursoClient } from "../db/turso";

/*async function getData() {
  try {
    const res = await tursoClient().execute('select * from Publicacion;');
    return {
      frameworks: res.rows,
    };
  } catch (error) {
    console.error(error);
    return {
      frameworks: []
    }
  }
}*/

export default async function Page() {
  //const { rows } = await tursoClient().execute("SELECT * FROM Publicacion");

  //const { frameworks } = await getData();  

  return (
    
    <ul>
      {/*frameworks.map((row) => (
        <li key={row.ID_publicacion}>{row.ID_publicacion}</li>
      ))*/}
    </ul>
  );
}