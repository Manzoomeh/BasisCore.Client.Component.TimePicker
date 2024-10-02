import IComponentManager from "../src/basiscore/IComponentManager";
import ISource from "../src/basiscore/ISource";
import IUserDefineComponent from "../src/basiscore/IUserDefineComponent";
import { IPartValue } from "./basiscore/ISchemaBaseComponent";
// import IBasisPanelOptions from "./src/basispanel/IBasisPanelOptions";

export default abstract class BasisPanelChildComponent implements IComponentManager {
  protected readonly owner: IUserDefineComponent;
  public readonly container: Element;
  // protected readonly options: IBasisPanelOptions;
  public input: HTMLInputElement;
  constructor(owner: IUserDefineComponent, layout: string, dataAttr: string) {
    this.owner = owner;
    this.input = document.createElement("input");
    this.container = document.createElement("div");
    this.container.setAttribute(dataAttr, "");
    this.owner.setContent(this.container);
    if (layout?.length > 0) {
      const range = new Range();
      range.setStart(this.container, 0);
      range.setEnd(this.container, 0);
      range.insertNode(range.createContextualFragment(layout));
    }
    // this.options = this.owner.getSetting<IBasisPanelOptions>(
    //   "basispanel.option",
    //   null
    // );
  }
  public abstract initializeAsync(): void | Promise<void>;
  public abstract runAsync(source?: ISource): any | Promise<any>;

  setValues(values: IPartValue[]) {
    if (values && values.length == 1) {
      this.input.value = values[0].value?.time;
    }
  }

  getValuesForValidate() {
    return this.input.value;
  }

  getAddedValuesAsync(): IPartValue[] {
    let retVal: IPartValue[] = null;
    const value = this.input.value;
    console.log("vssss", value);
    if (value?.length > 0) {
      retVal = new Array<IPartValue>();
      retVal.push({ value: {time: value, timeid : this.convertToMinutes(value)} });
    }
    return retVal;
  }

  getEditedValuesAsync(baseValues: IPartValue[]): IPartValue[] {
    let retVal: IPartValue[] = null;
    const baseValue = baseValues[0].value;
    const baseId = baseValues[0].id;
    const value = this.input.value;
    if (value?.length > 0 && value != baseValue) {
      retVal = new Array<IPartValue>();
      retVal.push({
        id: baseId,
        value: { time: value, timeid: this.convertToMinutes(value) },
      });
    }
    return retVal;
  }

  getDeletedValuesAsync(baseValues: IPartValue[]): IPartValue[] {
    let retVal: IPartValue[] = null;
    const value = this.input.value;
    if (value?.length == 0) {
      retVal = baseValues;
    }
    return retVal;
  }
  convertToMinutes(time: string): number {
    const is12HourFormat = /AM|PM/i.test(time);

    let hours: number, minutes: number;

    if (is12HourFormat) {
      // Parse 12-hour format
      const [timePart, meridiem] = time.split(" ");
      const [hourStr, minuteStr] = timePart.split(":");
      hours = parseInt(hourStr, 10);
      minutes = parseInt(minuteStr, 10);

      // Convert 12-hour to 24-hour format
      if (meridiem.toUpperCase() === "PM" && hours !== 12) {
        hours += 12;
      } else if (meridiem.toUpperCase() === "AM" && hours === 12) {
        hours = 0;
      }
    } else {
      // Parse 24-hour format
      const [hourStr, minuteStr] = time.split(":");
      hours = parseInt(hourStr, 10);
      minutes = parseInt(minuteStr, 10);
    }

    // Return the total minutes since midnight
    return hours * 60 + minutes;
  }
}
