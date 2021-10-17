import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges
} from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

export interface Dimensions {
    height: number;
    width: number;
}

export interface UploadError {
    file: File;
    type: 'accept' | 'fileSize' | 'dimensions' | 'http';
    error?: any;
    dimensions?: Dimensions; // only provided for 'dimensions' errors
}

@Component({
    selector: 'app-image-upload',
    templateUrl: 'image-upload.component.html',
    styleUrls: ['image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit, OnDestroy, OnChanges {

    // File blob provided from ngFile directive
    @Input() file: File;
    // Specify which kind of image you want to upload, e.g. 'image/jpeg'
    @Input() accept = 'image/*';
    // BucketPath
    @Input() path = 'Images';

    @Input() alreadyPresentUrl: string;

    @Output() urlEmitter: EventEmitter<string> = new EventEmitter<string>();

    @Output() progressEmitter: EventEmitter<number> = new EventEmitter<number>();

    public isDragValid: boolean;
    public progressValue = null;
    private readonly uploads: Subscription[] = [];
    downloadURL: Observable<string>;

    constructor(private storage: AngularFireStorage) {
    }

    ngOnInit() { }

    ngOnDestroy(): void {
        this.cancelUploads();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.file) {
            const file = changes.file.currentValue;
            if (file) {
                this.uploadImage(file);
            } else {
                this.clearFile(false);
            }
        }
    }

    private cancelUploads() {
        for (const subscription of this.uploads.splice(0, this.uploads.length)) {
            subscription.unsubscribe();
        }
    }

    onFileChange(file: File) {
        this.file = file;
        this.uploadImage(file);
    }

    onInvalidFile() {
        // even though the ngxFile directive won't update the file in this case, we still want to
        // clear any previously set image. This is important for consistency with other error
        // cases, where the error may be received after the image is set and so handled by removing
        // the invalid image selection (e.g. the minimum dimensions check, which is async)
        this.clearFile(true);
    }

    /**
    * Clear the currently selected image, also cancelling any upload.
    * @param emit
    *   If true, fire a change event. Should be true when the the user of the component would
    *   otherwise think the file was still set.
    * @return File that was cleared.
    */
    private clearFile(emit): File {
        const file = this.file;
        this.cancelUploads();
        this.progressValue = null;
        this.file = null;
        return file;
    }

    private uploadImage(file: File) {
        // Cancel previous uploads before starting a new one
        this.cancelUploads();
        this.progressEmitter.emit(0);

        // Start upload
        this.progressValue = null;
        this.alreadyPresentUrl = null;
        // Store the Subscription as http emitter for callbacks
        const date = Date.now();
        const filePath = `${this.path}/${date}`;
        const fileRef = this.storage.ref(filePath);
        const task = this.storage.upload(`${this.path}/${date}`, file);
        this.progressValue = 0;
        task
            .snapshotChanges()
            .pipe(
                finalize(() => {
                    this.downloadURL = fileRef.getDownloadURL();
                    this.downloadURL.subscribe(url => { if (url) { 
                        this.urlEmitter.emit(url); 
                        this.progressEmitter.emit(0);
                        }
                    });
                })
            )
            .subscribe(url => {
                if (url) { 
                    this.progressValue = (100 / url.totalBytes) * url.bytesTransferred; 
                    this.progressEmitter.emit(this.progressValue);
                }
            });
    }

}
