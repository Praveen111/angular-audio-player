import { Component, Input, ViewChild,ElementRef, ChangeDetectorRef  } from '@angular/core';
// import fasterImg from '../assets/faster.svg';
// import slowerImg from '../assets/slower.svg';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  // need to mention the track from source folder in src
  @Input() public src: string = '../assets/Humdard.mp3';
  @Input() public autoplay: boolean = false;
  @Input() public showStateLabel: boolean = false;
  public audioStateLabel = 'Audio sample';
  @Input() public volume: number = 1.0; /* 1.0 is loudest */

  @ViewChild('audioElement', { static: false })
  public _audioRef!: ElementRef;
  public audio!: HTMLMediaElement;
  @ViewChild('rangeElement') rangeElement:any;
  public _rangeRef!: ElementRef;
  private rangeEle!: HTMLInputElement;
  @ViewChild('startTimeRef') startTimeValue:any;
  public _startRef!: ElementRef;
  private startEle!: HTMLInputElement;
  // @ViewChild('volume') volumeElement:any;
  // public _volumeRef!: ElementRef;
  // private volumeEle!: HTMLInputElement;
  startTime = '';
  endTime = '';
  maxTime="";
  private timeInterval:any;

  public constructor(private cdr:ChangeDetectorRef) { }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.audioStateLabel = 'Paused';
      // this.timeInterval
      clearInterval(this.timeInterval);
    }
  }

  public get paused(): boolean {
    if (this.audio) {
      return this.audio.paused;
    } else {
      return true;
    }
  }

  public play(): void {
    if (this.audio) {
      if (this.audio.readyState >= 2) {
        this.audio.play();
        this.audioStateLabel = 'Playing...';
         this.updateSliderStatus()
      }
    }
  }

  // update the input while playing
  updateSliderStatus() {
    this.timeInterval = setInterval(() => {
      this.rangeEle.style.width = (this.audio.currentTime / this.audio.duration) * 100 + "%";
      const currentTime = this.getTimeCodeFromNum(
        this.audio.currentTime
      );
      const cTime = this.getTimeCodeFromNum(Math.ceil(this.audio.currentTime))+'';
      this.rangeEle.textContent = currentTime;
      this.startEle.textContent = cTime;
      this.rangeEle.max = '100';
      this.rangeEle.style.width = '44vw';
      this.rangeEle.value = ((Math.ceil(this.audio.currentTime)/ this.audio.duration) * 100)+''
     if(this.startEle.textContent === this.endTime) {
        clearInterval(this.timeInterval);
        this.audio.currentTime = 0;
        this.rangeEle.value = '0';
        this.startEle.value = '00:00';
        this.audio.pause();
      }
    }, 500);
  }

  //  on click of anywhere in input range
  seekTime(e:any) {
    const timeline = document.querySelector(".timeline-range");
    const timelineWidth:any = timeline?.clientWidth;
    const value = Math.floor((e.offsetX / timelineWidth) * 100);
    const v1 = (e.offsetX / timelineWidth).toFixed(2);
    this.rangeEle.value = value+'';
    this.audio.currentTime = Math.floor(this.audio.duration) * Number(v1);
  }

  public ngAfterViewInit() {
    this.audio = this._audioRef.nativeElement;
    this.rangeEle = this.rangeElement.nativeElement;
    this.startEle = this.startTimeValue.nativeElement;
    this.cdr.detectChanges();
    // this.volumeEle = this._volumeRef.nativeElement;
    // console.log("Value",this._volumeRef)
  }

  //turn 128 seconds into 2:08
  getTimeCodeFromNum(num:number) {
    let seconds = num;
    let minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;
    const hours = Math.floor(minutes / 60);
    minutes -= hours * 60;
  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2,'0')}`;
  return `${String(hours).padStart(2,'0')}:${minutes}:${String(
    seconds % 60
  ).padStart(2,'0')}`;
  }

  // initializes the audio component with UI 
  checkLoaded(event:any) {
    this.audio = event.srcElement;
    this.startTime = '00:00'
    this.endTime = this.getTimeCodeFromNum(Math.ceil(this.audio.duration))+'';
    this.audio.currentTime = 0;
    this.rangeEle.max = Math.ceil(this.audio.duration)+'';
  }

  muteOrUnmuteVolume(e:Event) {
    this.audio.muted = !this.audio.muted;
  }

  reset() {
    this.audio.currentTime = 0;
    this.rangeEle.value = '0';
    this.startTime = '00:00';
    this.startEle.textContent = '00:00'
  }

  forwardOrBackward(value:string) {
    if(value === "forward") {
      this.audio.currentTime += 10;
    } else {
      this.audio.currentTime -= 10;
    }
  }

  moreOrLessSpeed(value:string) {
    if(value === 'more') {
      this.audio.playbackRate += 0.25;
    } else {
      this.audio.playbackRate -= 0.25;
    }
  }

  volumeControl(e:any) {
    const volumeWidth = e.target.clientWidth;
    const sliderValue = e.target.value;
    const volumeValue:any = Math.ceil(volumeWidth * (sliderValue/100));
    this.audio.volume = (volumeValue/volumeWidth);
  }

  seekTime2(e:any) {
    const timeline = document.querySelector(".timeline-range");
    const timelineWidth:any = timeline?.clientWidth;
    const rangeWidth = Math.ceil((timelineWidth/ 100) * (e.target.value));
    this.rangeEle.value = Math.ceil((rangeWidth / timelineWidth) * 100)+'';
    const v1 = (rangeWidth / timelineWidth).toFixed(2);
    this.audio.currentTime = Math.floor(this.audio.duration) * Number(v1);
  }

}
