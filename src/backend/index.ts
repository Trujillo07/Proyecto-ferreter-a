import { Server } from 'azle';
import express, { NextFunction, Request, Response } from 'express';

type Inventario = {
    id: number;
    product: string;
    category: string;
}

let inventario: Inventario[] = [{
    id: 1,
    product: 'Reguilete',
    category: 'Jardineria'
}]

function logger(req: Request, res: Response, next: NextFunction) {
    console.log("se guardo correctamente");
    next();
}

export default Server(() => {
    const app = express();

    app.use(express.json());

    app.use(logger);

    //GET
    app.get('/inventario', (req, res) => {
        res.json(inventario);
    });

    //POST
    app.post("/inventario/:id", (req, res) => {
        const id = parseInt(req.params.id);
        const inventar = req.body;
        const inventarioExistente = inventario.find((inventario) => inventario.id === id);
    
        if (inventarioExistente) {
            res.status(404).send("Este producto ya esta en uso");
            return;
        }
        inventario.push({ ...inventar, id });
    
        res.send("OK");
    });

    //PUT
    app.put("/inventario/:id", (req, res) =>{
        const id = parseInt(req.params.id);
        const inventar = inventario.find((inventar) => inventar.id === id);

        if (!inventar) {
            res.status(404).send("Not found");
            return;
        }

        const updateInventar = { ...inventar, ...req.body };

        inventario = inventario.map((b) => b.id === updateInventar.id ? updateInventar : b);

        res.send("ok");

    })
 //DELETE
 app.delete("/inventar/:id", (req, res) =>{
    const id = parseInt(req.params.id);
    inventario = inventario.filter((inventar) => inventar.id !== id);
    res.send("ok")
});

return app.listen();
});