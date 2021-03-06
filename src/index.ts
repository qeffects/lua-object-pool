
export class ObjectPool<Obj>{
    private create: () => Partial<Obj>;
    private reset?: (o: Obj) => void;
    private maxSize: number | false;
    private freePool: Partial<Obj>[];

    constructor(
        initialSize:number,
        maxSize:number | false,
        creator: (this:any) => Obj,
        reset?: (this:any, o: Obj) => void
    ){
        this.create = creator;
        this.reset = reset;
        this.maxSize = maxSize;
        this.freePool = [];

        for (const i of $range(1, initialSize)){
            this.freePool[this.freePool.length] = this.create();
        }
    }

    take(): Partial<Obj>{
        /* @ts-ignore */
        return this.freePool.length === 0 ? this.create() : table.remove(this.freePool);
    }

    free(obj: Obj){
        if (this.reset){
            this.reset(obj);
        }

        if (this.maxSize){
            if (this.freePool.length<this.maxSize){
                this.freePool[this.freePool.length] = obj
            }
        } else {
            this.freePool[this.freePool.length] = obj
        }
    }

    clear(){
        for (const i of $range(1, this.freePool.length)){
            /* @ts-ignore */
            this.freePool[i-1] = undefined;
        }
    }
}