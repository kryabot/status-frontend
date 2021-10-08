import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {BackendService} from "../services/backend.service";
import {StartupResponse} from "../models/StartupResponse";
import {PingResponse} from "../models/PingResponse";
import {CardDetails} from "../models/CardDetails";
import {interval} from "rxjs";

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  //changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  twitchTmiAdapter: CardDetails = new CardDetails("Twitch TMI adapter")
  twitchBot: CardDetails = new CardDetails("Twitch KryaBot")
  twitchSpamDetector:CardDetails = new CardDetails("Twitch Spam Detector")
  externalApi: CardDetails = new CardDetails("External API")
  internalApi: CardDetails = new CardDetails("Internal API")
  telegramKryaBot: CardDetails = new CardDetails("Telegram KryaBot")
  telegramInfoBot: CardDetails = new CardDetails("Telegram InfoBot")
  telegramInfoManager: CardDetails = new CardDetails("Telegram Info Manager")
  telegramAuthBot: CardDetails = new CardDetails("Telegram AuthBot")

  pingResponse: PingResponse = null;
  startupResponse: StartupResponse = null;
  constructor(private backend: BackendService, private changeDetector: ChangeDetectorRef) { }

  dateFormat: string = "";

  ngOnInit(): void {
    this.backend.getPingStatus().subscribe((response: PingResponse)  => {
      this.externalApi.status = true;
      this.internalApi.status = response.webserver;
      this.telegramInfoBot.status = response.telegramInfobot;
      this.telegramAuthBot.status = response.telegramAuthbot;
      this.telegramKryaBot.status = response.telegramBot;
      this.telegramInfoManager.status = response.telegramInfomanager;
      this.twitchTmiAdapter.status = response.twitchTmi;
      this.twitchBot.status = response.twitchBot;
      this.twitchSpamDetector.status = response.twitchSpamDetector;

      this.pingResponse = response;
    })

    this.backend.getStartupStatus().subscribe((response: StartupResponse) => {

      this.twitchTmiAdapter.started = response.twitchTmi;
      this.twitchSpamDetector.started = response.twitchSpamDetector;
      this.twitchBot.started = response.twitchBot;
      this.internalApi.started = response.webserver;
      this.externalApi.started = new Date();
      this.telegramInfoManager.started = response.telegramInfomanager;
      this.telegramInfoBot.started = response.telegramInfobot;
      this.telegramAuthBot.started = response.telegramAuthbot;
      this.telegramKryaBot.started = response.telegramBot;

      this.startupResponse = response;
    })

    interval(1000).subscribe(() => {
      this.changeDetector.detectChanges();
    });
  }

  translateStatus(status): string{
    if(status == null){
      return "danger"
    }
    if(status){
      return "info"
    } else {
      return "danger"
    }
  }

  translateStatusText(status): string{
    if(status == null){
      return "OFFLINE"
    }
    if(status){
      return "ONLINE"
    } else {
      return "OFFLINE"
    }
  }

  formatUptime(card): string {
    if(card.status == null || !card.status)
      return "";
    if(card.started == null)
      return "";

    let now = new Date()
    let totalSeconds = Math.floor((now.getTime() - new Date(card.started).getTime()) / 1000);
    // Adjust to UTC, because new Date creates local tz date
    totalSeconds = totalSeconds + (now.getTimezoneOffset() * 60)

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (totalSeconds >= 3600 * 24) {
      days = Math.floor(totalSeconds / (3600 * 24));
      totalSeconds -= 3600 * 24 * days;
    }

    if (totalSeconds >= 3600) {
      hours = Math.floor(totalSeconds / 3600);
      totalSeconds -= 3600 * hours;
    }

    if (totalSeconds >= 60) {
      minutes = Math.floor(totalSeconds / 60);
      totalSeconds -= 60 * minutes;
    }

    seconds = totalSeconds;

    return `${days} days, ${hours} hours, ${minutes} minutes`
  }


}
