import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-base-dialog',
  imports: [],
  templateUrl: './base-dialog.html',
  styleUrl: './base-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseDialog {

}
