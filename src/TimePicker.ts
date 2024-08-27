import layout from "../src/widget1.html";
import IUserDefineComponent from "../src/basiscore/IUserDefineComponent";
import BasisPanelChildComponent from "../src/BasisPanelChildComponent";
import { TimepickerUI } from "timepicker-ui";
import { OptionTypes } from "timepicker-ui";
import "./asset/timePickerStyle.css"
import { clockType } from "./type-alias";
interface ITimePickerOptions {
  okLabel: string;
  cancelLabel: string ; 
  amLabel : string;
  pmLabel : string;
  clockType : clockType;
}

export  default abstract class TimePicker extends BasisPanelChildComponent {
  
  public runType: boolean = true;
  protected activeComponent: Element;
  protected activeHeader: Element;
  protected tabNodes: Element[] = [];
  protected headerWrapper: Element;
  protected bodyWrapper: Element;
  protected firstTabInitialize = false;

  private  options : ITimePickerOptions
  constructor(owner: IUserDefineComponent, container) {
    super(owner, layout, container);
  }

 
  async initializeComponent(
    activeComponent: Element,
    id: number,
    runFlag : boolean,
    runOnClick: boolean = false
  ): Promise<void> {
    
  }

  async runAsync(source?): Promise<any> {
    this.createTimePicker()
  }
public createTimePicker(){
  console.log("time")
  const input = document.createElement("div")
  const input2 = document.createElement("input")
  input.appendChild(input2)
  input.setAttribute("data-bc-timepicker","")
  const datePickerOptions : OptionTypes = {
    okLabel :this.options.okLabel ? this.options.okLabel : "تایید",
    cancelLabel:this.options.cancelLabel ? this.options.cancelLabel : "انصراف",
    amLabel:this.options.amLabel ? this.options.amLabel : "ق.ظ",
    pmLabel:this.options.pmLabel ? this.options.pmLabel : "ب.ظ",
    clockType:this.options.clockType ? this.options.clockType : "24h" ,
    timeLabel : "",
    delayHandler:10 ,   
    switchToMinutesAfterSelectHour : true};
   const newTimepicker = new TimepickerUI(input, datePickerOptions);
   this.container.appendChild(input)
   input2.addEventListener("click",timeElement => {     
     // modalParent.style.display="none"
      newTimepicker.open();
    })
}

public async getOptions(): Promise<void> {
  const optionsString =  await this.owner.getAttributeValueAsync("options");
  const options = eval(optionsString)
  this.options = {okLabel :options.okLabel,
    cancelLabel:options.cancelLabel,
    amLabel:options.amLabel,
    pmLabel:options.pmLabel,
    clockType:options.clockType,
 
  }
  
}
public async initializeAsync(): Promise<void> {
  await this.getOptions();

}
}
