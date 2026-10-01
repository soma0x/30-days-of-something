import Pic from '@/components/Pic';
import {read,money} from '@/lib/db';import {saveProduct,deleteProduct} from '@/lib/actions';
export default function AP(){const {products}=read();
 return <><form action={saveProduct} className="card form" style={{marginBottom:24}}><h3>New product</h3>
  <input name="name" placeholder="Name" required/><input name="price" type="number" step="0.01" placeholder="Price" required/>
  <input name="stock" type="number" placeholder="Stock"/><input name="category" placeholder="Category"/><input name="image" placeholder="Image URL (optional)"/>
  <textarea name="description" placeholder="Description" rows="3"/><button className="btn">Add product</button></form>
  <table><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th/></tr></thead><tbody>{products.map(p=><tr key={p.id}>
   <td><span className="inl"><Pic p={p} className="xs"/>{p.name}</span></td><td>{money(p.price)}</td><td>{p.stock}</td><td><form action={deleteProduct.bind(null,p.id)}><button className="link muted">Delete</button></form></td></tr>)}</tbody></table></>}
