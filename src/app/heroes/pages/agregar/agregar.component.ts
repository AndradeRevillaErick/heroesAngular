import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [`
    img{
      width: 100%;
      border-radius: 5px;
    }
  `
  ]
})
export class AgregarComponent implements OnInit {

  heroe: Heroe = {
    superhero : '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '', 
  }

  publishers = [
    {
      id: 'DC= Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ]

  constructor(private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit(): void {

    if( !this.router.url.includes('editar') ){
      return;
    }

    this.activatedRoute.params
      .pipe( 
        switchMap( ({id}) => this.heroesService.getHeroePorId( id ) )
      )
      .subscribe( heroe => this.heroe = heroe );

  }

  guardar(){

    if(this.heroe.superhero.trim().length === 0){return}

    if(this.heroe.id){
      this.heroesService.actualizarHeroe( this.heroe )
        .subscribe( heroe => this.mostrarSnackBar('Registro Actualizado') );
    }else{
      this.heroesService.agregarHeroe( this.heroe )
        .subscribe( heroe => {
          this.mostrarSnackBar('Registro Creado')
          this.router.navigate( ['/heroes/editar', heroe.id] );
        })
    }

  }

  borrarHeroe(){

    const dialog = this.dialog.open( ConfirmarComponent, {
      width: '250px',
      data: this.heroe
      // data: { ...this.heroe } //para que no se modifique, ya que esto se pasa por referencia (es una opcion)
    } );

    //Implementar switchMap
    dialog.afterClosed().subscribe(
      (result) => {
        if( result ){
          this.heroesService.borrarHeroe( this.heroe.id! )
          .subscribe( resp => {
            this.router.navigate(['/heroes']);
          });
        }
      }
    )
    
  }

  mostrarSnackBar(mensaje: string): void{
    this.snackBar.open( mensaje, 'Ok!', {
      duration: 2500
    } );
  }
}
