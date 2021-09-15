
export class ObjectPool<Obj>{
    create: () => Partial<Obj>;
    maxSize: number | false;
    freePool: Partial<Obj>[]|undefined[];

    constructor(initialSize:number, maxSize:number | false, creator: (this:any) => Obj){
        this.create = creator;
        this.maxSize = maxSize;
        this.freePool = [];

        for (const i of $range(1, initialSize)){
            this.freePool[this.freePool.length] = this.create();
        }
    }

    take(){
        return this.freePool.length === 0 ? this.create() : table.remove(this.freePool);
    }

    free(obj: Obj){
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
            this.freePool[i-1] = undefined;
        }
    }
}