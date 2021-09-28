<template>
	<view class="content">
		<!-- <text>
			Zombie ipsum reversus ab viral inferno, nam rick grimes malum cerebro. De carne lumbering animata corpora
			quaeritis. Summus brains sit​​, morbo vel maleficia? Deapocalypsi gorger omero undead survivor dictum
			mauris. Hi mindless mortuis soulless creaturas, imo evil
			stalking monstra adventus resi dentevil vultus comedat cerebella
			viventium. Qui animated corpse, cricket bat max brucks terribilem incessu zomby. The voodoo sacerdos flesh
			eater, suscitat mortuos comedere carnem virus. Zonbi tattered
			for solum oculi eorum defunctis go lum cerebro. Nescio brains an Undead zombies. Sicut malus putrid voodoo
			horror. Nigh tofth eliv ingdead. Cum horribilem walking dead
			resurgere de crazed sepulcris creaturis, zombie sicut de grave feeding iride et serpens. Pestilentia, shaun
			ofthe dead scythe animated corpses ipsa screams. Pestilentia
			est plague haec decaying ambulabat mortuos. Sicut zeder apathetic malus voodoo. Aenean a dolor plan et
			terror soulless vulnerum contagium accedunt, mortui iam vivam
			unlife. Qui tardius moveri, brid eof reanimator sed in magna copia sint terribiles undeath legionis. Alii
			missing oculis aliorum sicut serpere crabs nostram. Putridi
			braindead odores kill and infect, aere implent left four dead. Lucio fulci tremor est dark vivos magna.
			Expansis creepy arm yof darkness ulnis witchcraft missing carnem
			armis Kirkman Moore and Adlard caeruleum in locis. Romero morbo Congress amarus in auras. Nihil horum
			sagittis tincidunt, zombie slack-jawed gelida survival portenta.
			The unleashed virus est, et iam zombie mortui ambulabunt super terram. Souless mortuum glassy-eyed oculos
			attonitos indifferent back zom bieapoc alypse. An hoc dead
			snow braaaiiiins sociopathic incipere Clairvius Narcisse, an ante? Is bello mundi z?
		</text>
		<radio :checked="check" @click="changeCheck" class="checkState">我已认真阅读合同全部条款</radio>
		<button type="primary" @click="signature" class="signatureBtn" :disabled="!check">签名</button> -->
		<canvas id="qrcode" canvas-id="qrcode" style="width: 354px;height: 354px;" />
		<button type="primary" @click="uploadPact" class="uploadBtn">上传纸质合同</button>
	</view>
</template>

<script>
	import config from '../../../common/config.js';
	import uQRCode from '../../../components/uqrcode/common/uqrcode.js'
	export default {
		data() {
			return {
				check: true,
			};
		},
		onReady() {
		    uQRCode.make({
		        canvasId: 'qrcode',
		        componentInstance: this,
		        size: 354,
		        margin: 10,
		        text: '合同地址',
		        backgroundColor: '#ffffff',
		        foregroundColor: '#000000',
		        fileType: 'png',
		        errorCorrectLevel: uQRCode.errorCorrectLevel.H
		    })
		    .then(res => {
		        console.log(res)
		    })
		  },
		methods: {
			changeCheck() {
				this.check = !this.check;
			},
			signature() {
				uni.navigateTo({
					url: '/pages/model/InCar/Signature'
				})
			},
			uploadPact() {
				uni.chooseImage({
					success(res) {
						uni.navigateTo({
							url:'/pages/model/InCar/Finish'
						});
					}
				})
			}
		}
	};
</script>

<style lang="scss">
	.checkState {
		margin-top: 20rpx;
	}

	.signatureBtn {
		margin-top: 20rpx;
		margin-bottom: 20rpx;
		width: 200rpx;
	}

	.uploadBtn {
		width: 400rpx;
		margin-bottom: 20rpx;
	}
</style>
