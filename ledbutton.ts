/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="" block="LEDボタン"
namespace IMLledbutton
{
    export enum ButtonMode {
        //% block="トグルボタン"
        toggle = 1,
        //% block="プッシュボタン"
        push = 2
    }

    const BUTTON_EVENT_ID = 1001
    const BUTTON_PRESSED = 0
    const BUTTON_RELEASED = 1
    const BUTTON_TURNON = 1
    const BUTTON_TURNOFF = 2
    const LED_ON = 1
    const LED_OFF = 0
    let pressstatus = false
    let beforetoggle = false
    let buttonmode = ButtonMode.toggle;
    let buttonpin = DigitalPin.P2
    let ledpin = DigitalPin.P1

    //% block="モード設定 %m %pin"
    //% weight=100   
    export function setomode(mode: ButtonMode, pin: DigitalPin) {
        buttonmode = mode;
        setpin(pin)
        pins.digitalWritePin(ledpin, 0)
        pressstatus = false
        beforetoggle = false
    }

    //% block="押されている"
    //% weight=99   
    export function ispush(): boolean {
        return pressstatus
    }

    //% block="ONになっている"
    //% weight=98   
    export function ison(): boolean {
        return beforetoggle
    }

    //% block="OFFになっている"
    //% weight=97   
    export function isoff(): boolean {
        return !beforetoggle
    }

    function setpin(pin: DigitalPin){
        switch(pin){
            case DigitalPin.P1:
                buttonpin = DigitalPin.P2
                ledpin = DigitalPin.P1
                break;
            case DigitalPin.P0:
                buttonpin = DigitalPin.P1
                ledpin = DigitalPin.P0
                break;
            case DigitalPin.P2:
                buttonpin = DigitalPin.P12
                ledpin = DigitalPin.P2
                break;
            case DigitalPin.P15:
                buttonpin = DigitalPin.P16
                ledpin = DigitalPin.P15
                break;
        }
    }

    // ボタンが押されたときのイベントハンドラ
    //% blockId=on_button_pressed block="ボタンが押されたとき"
    //% weight=80   
    export function onButtonPressed(handler: () => void): void {
        control.onEvent(BUTTON_EVENT_ID, BUTTON_PRESSED, handler)
    }
    // ボタンがONになったときのイベントハンドラ
    //% blockId=turn_button_on block="ボタンがONになったとき"
    //% weight=79   
    export function turnButtonOn(handler: () => void): void {
        control.onEvent(BUTTON_EVENT_ID, BUTTON_TURNON, handler)
    }
    // ボタンがOFFになったときのイベントハンドラ
    //% blockId=turn_button_off block="ボタンがOFFになったとき"
    //% weight=78   
    export function turnButtonOff(handler: () => void): void {
        control.onEvent(BUTTON_EVENT_ID, BUTTON_TURNOFF, handler)
    }

    basic.forever(function() { 
    /* control.inBackground(function() { */ 
        if( pins.digitalReadPin(buttonpin) == BUTTON_PRESSED )
        {
            if( pressstatus == false ){
                /* 押された */
                pressstatus = true
            }
        }
        else
        {
            if (pressstatus == true) {
                /* 離された */
                pressstatus = false

                if( buttonmode == ButtonMode.toggle )
                {
                    if( beforetoggle == false){
                        beforetoggle = true;
                        pins.digitalWritePin(ledpin,LED_ON)
                        // ONになったときにイベントを発生
                        control.raiseEvent(BUTTON_EVENT_ID, BUTTON_TURNON)
                    }
                    else{
                        beforetoggle = false;
                        pins.digitalWritePin(ledpin,LED_OFF)
                        // OFFになったときにイベントを発生
                        control.raiseEvent(BUTTON_EVENT_ID, BUTTON_TURNOFF)
                    }
                }
                else
                {
                    // ボタンが押されたときにイベントを発生
                    control.raiseEvent(BUTTON_EVENT_ID, BUTTON_PRESSED)
                }
            }
        }    
        basic.pause(100)
    })
}
