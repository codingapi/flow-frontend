import {SubProcessViewProps} from "@/script-components/components/sub-process/typings";


export class SubProcessPresenter{

    private readonly props:SubProcessViewProps;

    constructor(props:SubProcessViewProps) {
        this.props = props;
    }

    public parserFormData(value:string){
        // todo script to formData
        console.log('parserFormData:',value)
        return {};
    }

    public updateFormData(values:any){
        // todo update script
        console.log('updateFormData',values);
        // this.props.onChange()
    }

}