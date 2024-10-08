import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RecordarContrasenaComponent } from 'src/app/components/recordar-contrasena/recordar-contrasena.component';
import { User } from 'src/app/models/user.model';
import { FirebaseConfigService } from 'src/app/services/fireBaseConfig/firebase-config.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  firebase = inject(FirebaseConfigService);
  utils = inject(UtilsService);

  async submit() {
    if (this.loginForm.valid) {
      const loading = await this.utils.loading();
      await loading.present();
      this.firebase
        .signIn(this.loginForm.value as User)
        .then((res) => {
          this.getUserInfo(res.user.uid);
        })
        .catch((error) => {
          console.log(error);
          this.utils.presentToast({
            message: error.message,
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    }
  }

  async getUserInfo(uid: string) {
    if (this.loginForm.valid) {
      let path = `users/${uid}`;
      this.loginForm.controls.uid.setValue(uid);

      this.firebase
        .getDocument(path)
        .then((user: User) => {
          delete this.loginForm.value.password;
          this.utils.saveInlocalStorage('user', this.loginForm.value);
          this.loginForm.reset;
          this.utils.routerlink('home');
          this.loginForm.reset();

          this.utils.presentToast({
            header: 'Login exitoso!',
            message: `Te damos la bienvenida ${user.email}`,
            duration: 2000,
            color: 'primary',
            position: 'middle',
            icon: 'person-circle-outline',
          });
        })
        .catch((error) => {
          console.log(error);
          this.utils.presentToast({
            message: error.message,
            duration: 2500,
            color: 'primary',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        });
    }
  }

  recordarContrasena() {
    this.utils.presentarModal({
      component: RecordarContrasenaComponent,
    });
  }
}
