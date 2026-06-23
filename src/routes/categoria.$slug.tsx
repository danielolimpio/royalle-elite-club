import { createFileRoute, Link, notFound, useParams } from "@tanstack/react-router";
import { ArrowUpRight, MapPin } from "lucide-react";
import { SiteShell } from "@/components/site/SiteLayout";
import { slugify } from "@/lib/slug";
import catEstrada from "@/assets/cat-estrada.jpg";
import catCupom from "@/assets/cat-cupom.jpg";
import catCarreira from "@/assets/cat-carreira.jpg";
import catAuto from "@/assets/cat-autocuidado.jpg";
import catDivertir from "@/assets/cat-divertir.jpg";
import catSextou from "@/assets/cat-sextou.jpg";
import catComer from "@/assets/cat-comer.jpg";
import catLar from "@/assets/cat-lar.jpg";
import catPet from "@/assets/cat-pet.jpg";
import catAchadinhos from "@/assets/cat-achadinhos.jpg";
import catIconCashback from "@/assets/cat-icon-cashback.jpg";
import catIconNovidades from "@/assets/cat-icon-novidades.jpg";
import catIconGratuitos from "@/assets/cat-icon-gratuitos.jpg";
import catIconCinema from "@/assets/cat-icon-cinema.jpg";
import catIconFarmacia from "@/assets/cat-icon-farmacia.jpg";
import catIconSustentabilidade from "@/assets/cat-icon-sustentabilidade.jpg";
import catIconDelivery from "@/assets/cat-icon-delivery.jpg";
import catIconEletro from "@/assets/cat-icon-eletro.jpg";
import catModa from "@/assets/cat-moda.jpg";
import catSupermercado from "@/assets/cat-supermercado.jpg";
import catTecnologia from "@/assets/cat-tecnologia.jpg";
import catCasaDec from "@/assets/cat-casa-decoracao.jpg";
import catViagens from "@/assets/cat-viagens.jpg";
import catBeleza from "@/assets/cat-beleza.jpg";
import catPetShop from "@/assets/cat-petshop.jpg";
import catEducacao from "@/assets/cat-educacao.jpg";
import catTelecom from "@/assets/cat-telecom.jpg";
import catFinanceiro from "@/assets/cat-financeiro.jpg";
import catAutomotivo from "@/assets/cat-automotivo.jpg";
import catInfantil from "@/assets/cat-infantil.jpg";
import catGames from "@/assets/cat-games.jpg";

type Cat = { name: string; img: string; eyebrow: string; desc: string; items: { brand: string; desc: string; city: string; tag: string }[] };

const CATEGORIES: Record<string, Cat> = {
  "pe-na-estrada": { name: "Pé na estrada", img: catEstrada, eyebrow: "Royalle Travel", desc: "Companhias aéreas, locadoras, hotéis e experiências para sua próxima jornada.", items: [
    { brand: "Privé Voyages", desc: "Cashback 8% em pacotes internacionais", city: "Online", tag: "8% cashback" },
    { brand: "Royal Cruzeiros", desc: "5% de desconto em transatlânticos", city: "Santos", tag: "5% off" },
    { brand: "World Tour", desc: "Até 17% em hotéis premium", city: "Porto Alegre", tag: "17% off" },
    { brand: "Agaxtur Tour", desc: "Benefícios em pacotes assinados", city: "São Paulo", tag: "Exclusivo" },
    { brand: "Sky Charter", desc: "Fretamentos executivos", city: "São Paulo", tag: "VIP" },
    { brand: "Lumière Hotels", desc: "Late check-out + welcome drink", city: "Rio de Janeiro", tag: "Cortesia" },
  ]},
  "fome-de-cupom": { name: "Fome de cupom", img: catCupom, eyebrow: "Royalle Deals", desc: "Cupons curados e ofertas com cashback nas marcas que você mais ama.", items: [
    { brand: "Amazon Prime", desc: "Até 10% de desconto", city: "Online", tag: "10% off" },
    { brand: "Magalu Royale", desc: "Cupom de R$50", city: "Online", tag: "R$50" },
    { brand: "Renner Club", desc: "15% para membros", city: "Online", tag: "15% off" },
    { brand: "Centauro Plus", desc: "Frete grátis Royalle", city: "Online", tag: "Frete" },
    { brand: "Shopee Premium", desc: "Cupons combo", city: "Online", tag: "Combo" },
    { brand: "Mercado Livre", desc: "Cashback 3%", city: "Online", tag: "3%" },
  ]},
  "foco-na-carreira": { name: "Foco na carreira", img: catCarreira, eyebrow: "Royalle Pro", desc: "Cursos, mentorias, idiomas e tecnologia para acelerar sua trajetória.", items: [
    { brand: "Brasas English", desc: "Até 40% em cursos", city: "Online", tag: "40% off" },
    { brand: "Alura Premium", desc: "3 meses grátis", city: "Online", tag: "3 meses" },
    { brand: "FGV Executivo", desc: "MBA com bolsa Royalle", city: "Rio de Janeiro", tag: "Bolsa" },
    { brand: "Mentora Co.", desc: "Mentorias 1:1", city: "Online", tag: "1:1" },
    { brand: "Coursera Plus", desc: "Anuidade com desconto", city: "Online", tag: "Anuidade" },
    { brand: "LinkedIn Learning", desc: "Cashback 5%", city: "Online", tag: "5%" },
  ]},
  "autocuidado": { name: "Autocuidado", img: catAuto, eyebrow: "Royalle Wellness", desc: "Spas, dermatologia, fitness e cosméticos premium para o seu ritual.", items: [
    { brand: "Curitiba Fitness", desc: "Até 30% de desconto", city: "Curitiba", tag: "30% off" },
    { brand: "Avon Boutique", desc: "Até 40% de desconto", city: "Online", tag: "40% off" },
    { brand: "Barbearia do Zé", desc: "Até 25% de desconto", city: "Belo Horizonte", tag: "25% off" },
    { brand: "Spa Maison Or", desc: "Day spa com 20% off", city: "São Paulo", tag: "20% off" },
    { brand: "Derma Clinique", desc: "Avaliação cortesia", city: "Rio de Janeiro", tag: "Cortesia" },
    { brand: "Yoga House", desc: "Aula experimental", city: "Online", tag: "Trial" },
  ]},
  "para-se-divertir": { name: "Para se divertir", img: catDivertir, eyebrow: "Royalle Joy", desc: "Cinemas, parques, shows e experiências para os melhores momentos.", items: [
    { brand: "Beach Park", desc: "Até 15% de desconto", city: "Fortaleza", tag: "15% off" },
    { brand: "Cinépolis VIP", desc: "Sessão privê", city: "Brasil", tag: "VIP" },
    { brand: "Hot Park", desc: "Ingresso com 20% off", city: "Caldas Novas", tag: "20% off" },
    { brand: "Hopi Hari", desc: "Combo família", city: "São Paulo", tag: "Família" },
    { brand: "Live Nation", desc: "Pré-venda Royalle", city: "Brasil", tag: "Pré-venda" },
    { brand: "Sympla Plus", desc: "Cashback em shows", city: "Online", tag: "Cashback" },
  ]},
  "sextou": { name: "Sextou", img: catSextou, eyebrow: "Royalle Nights", desc: "Bares, restaurantes, baladas e drinks para começar o fim de semana.", items: [
    { brand: "Bar do Conde", desc: "Drinks com 20% off", city: "São Paulo", tag: "20% off" },
    { brand: "Skye Rooftop", desc: "Reserva privê", city: "São Paulo", tag: "Reserva" },
    { brand: "Casa do Saber", desc: "Jantar harmonizado", city: "Rio de Janeiro", tag: "Combo" },
    { brand: "Empório do Vinho", desc: "Garrafa cortesia", city: "Brasília", tag: "Cortesia" },
    { brand: "Pub Royal", desc: "Happy hour estendido", city: "Belo Horizonte", tag: "Happy" },
    { brand: "Le Bistrot", desc: "Sobremesa cortesia", city: "Curitiba", tag: "Cortesia" },
  ]},
  "comer-bem": { name: "Comer bem", img: catComer, eyebrow: "Royalle Table", desc: "Restaurantes, delivery gourmet e experiências gastronômicas curadas.", items: [
    { brand: "Berrini Café", desc: "10% de desconto", city: "São Paulo", tag: "10% off" },
    { brand: "iFood Black", desc: "Cupom Royalle", city: "Online", tag: "Cupom" },
    { brand: "Outback Privê", desc: "Sobremesa cortesia", city: "Brasil", tag: "Cortesia" },
    { brand: "Madero Prime", desc: "10% para membros", city: "Brasil", tag: "10% off" },
    { brand: "Coco Bambu", desc: "Combo casal", city: "Brasil", tag: "Combo" },
    { brand: "Sushi Lounge", desc: "Rodízio 15% off", city: "São Paulo", tag: "15% off" },
  ]},
  "lar-doce-lar": { name: "Lar doce lar", img: catLar, eyebrow: "Royalle Home", desc: "Decoração, móveis, eletro e tudo para deixar a sua casa única.", items: [
    { brand: "Ao Cubo Studio", desc: "20% em decoração", city: "Rio de Janeiro", tag: "20% off" },
    { brand: "Tok&Stok Royale", desc: "Cashback 4%", city: "Online", tag: "4% cashback" },
    { brand: "Westwing Home", desc: "Frete grátis Royalle", city: "Online", tag: "Frete" },
    { brand: "Etna Decora", desc: "15% de desconto", city: "Brasil", tag: "15% off" },
    { brand: "Compra Certa", desc: "2% cashback", city: "Online", tag: "2%" },
    { brand: "Mobly", desc: "Cupom de R$100", city: "Online", tag: "R$100" },
  ]},
  "cuidados-pet": { name: "Cuidados pet", img: catPet, eyebrow: "Royalle Pet", desc: "Petshops, banho e tosa, planos de saúde e ração premium.", items: [
    { brand: "Beni Pet Store", desc: "Até 15% de desconto", city: "São Paulo", tag: "15% off" },
    { brand: "Petlove Royale", desc: "Cashback 6%", city: "Online", tag: "6% cashback" },
    { brand: "Cobasi Premium", desc: "Frete grátis", city: "Online", tag: "Frete" },
    { brand: "Pet Care Plan", desc: "Mensalidade 20% off", city: "Brasil", tag: "20% off" },
    { brand: "Banho & Tosa Lux", desc: "Cortesia spa pet", city: "São Paulo", tag: "Cortesia" },
    { brand: "Hospital Vet 24h", desc: "Consulta com bolsa", city: "Rio de Janeiro", tag: "Bolsa" },
  ]},
  "achadinhos": { name: "Achadinhos", img: catAchadinhos, eyebrow: "Royalle Finds", desc: "Pequenas joias e ofertas inesperadas selecionadas pelo nosso time.", items: [
    { brand: "Sabrina Pratas", desc: "15% em prataria artesanal", city: "Minas Gerais", tag: "15% off" },
    { brand: "Boss Detail", desc: "15% em estética automotiva", city: "Brasília", tag: "15% off" },
    { brand: "Ponto Fino", desc: "2,5% cashback em eletrônicos", city: "Online", tag: "2,5%" },
    { brand: "Lapidé Joias", desc: "Frete grátis", city: "Online", tag: "Frete" },
    { brand: "Vinho do Mês", desc: "Garrafa cortesia", city: "Online", tag: "Cortesia" },
    { brand: "Café Especial", desc: "Assinatura com 20%", city: "Online", tag: "20% off" },
  ]},
  "cashback": { name: "Cashback", img: catIconCashback, eyebrow: "Royalle Cash", desc: "Receba parte do valor de volta nas marcas mais desejadas.", items: [
    { brand: "Édition Privée", desc: "Cashback 12%", city: "Online", tag: "12%" },
    { brand: "Privé Voyages", desc: "Cashback 8%", city: "Online", tag: "8%" },
    { brand: "Compra Certa", desc: "Cashback 2%", city: "Online", tag: "2%" },
    { brand: "Ponto Fino", desc: "Cashback 2,5%", city: "Online", tag: "2,5%" },
  ]},
  "novidades": { name: "Novidades", img: catIconNovidades, eyebrow: "Recém-chegados", desc: "As parcerias mais novas do clube Royalle.", items: [
    { brand: "Sabrina Pratas", desc: "Acessórios de prata", city: "Minas Gerais", tag: "Novo" },
    { brand: "Royal Cruzeiros", desc: "Agência premium", city: "Santos", tag: "Novo" },
    { brand: "Lumière Hotels", desc: "Hotelaria de luxo", city: "Rio de Janeiro", tag: "Novo" },
  ]},
  "gratuitos": { name: "Gratuitos", img: catIconGratuitos, eyebrow: "Sem custo", desc: "Benefícios totalmente gratuitos para membros Royalle.", items: [
    { brand: "Coursera Free", desc: "Cursos liberados", city: "Online", tag: "Grátis" },
    { brand: "Derma Clinique", desc: "Avaliação cortesia", city: "Rio de Janeiro", tag: "Grátis" },
    { brand: "Yoga House", desc: "Aula experimental", city: "Online", tag: "Grátis" },
  ]},
  "cinema": { name: "Cinema", img: catIconCinema, eyebrow: "Sessões privê", desc: "Pré-estreias, sessões VIP e combos para a galera.", items: [
    { brand: "Cinépolis VIP", desc: "Sessão privê", city: "Brasil", tag: "VIP" },
    { brand: "Cinemark Club", desc: "Combo para 2", city: "Brasil", tag: "Combo" },
    { brand: "UCI Premium", desc: "Cortesia de pipoca", city: "Brasil", tag: "Cortesia" },
  ]},
  "farmacia": { name: "Farmácia", img: catIconFarmacia, eyebrow: "Saúde sempre", desc: "Descontos em medicamentos, perfumaria e suplementos.", items: [
    { brand: "Drogaria Royale", desc: "Até 30% em genéricos", city: "Brasil", tag: "30% off" },
    { brand: "Pague Menos Plus", desc: "Cashback 4%", city: "Brasil", tag: "4%" },
    { brand: "Raia Premium", desc: "Frete grátis", city: "Online", tag: "Frete" },
  ]},
  "sustentabilidade": { name: "Sustentabilidade", img: catIconSustentabilidade, eyebrow: "Marcas verdes", desc: "Marcas conscientes com pegada sustentável.", items: [
    { brand: "Natura Verdê", desc: "20% para membros", city: "Brasil", tag: "20% off" },
    { brand: "Insecta Shoes", desc: "Cashback 5%", city: "Online", tag: "5%" },
    { brand: "Refil Co.", desc: "Assinatura ecológica", city: "Online", tag: "Eco" },
  ]},
  "delivery": { name: "Delivery", img: catIconDelivery, eyebrow: "Em casa", desc: "Entregas rápidas e descontos exclusivos no delivery.", items: [
    { brand: "iFood Black", desc: "Cupom Royalle", city: "Online", tag: "Cupom" },
    { brand: "Rappi Prime", desc: "Mensalidade cortesia", city: "Online", tag: "Cortesia" },
    { brand: "James Delivery", desc: "Frete grátis", city: "Online", tag: "Frete" },
  ]},
  "eletro": { name: "Eletro", img: catIconEletro, eyebrow: "Para o lar", desc: "Eletrodomésticos, eletroportáteis e tecnologia para sua casa.", items: [
    { brand: "Brastemp Royale", desc: "Cashback 2%", city: "Online", tag: "2%" },
    { brand: "Consul Plus", desc: "Frete grátis", city: "Online", tag: "Frete" },
    { brand: "KitchenAid Lab", desc: "10% para membros", city: "Online", tag: "10% off" },
  ]},
  "moda": { name: "Moda", img: catModa, eyebrow: "Royalle Style", desc: "As maisons mais desejadas em moda feminina, masculina e infantil com condições exclusivas.", items: [
    { brand: "Renner Club", desc: "15% para membros", city: "Brasil", tag: "15% off" },
    { brand: "Riachuelo Plus", desc: "Cashback 4%", city: "Brasil", tag: "4%" },
    { brand: "Zattini Boutique", desc: "Frete grátis Royalle", city: "Online", tag: "Frete" },
    { brand: "Dafiti Premium", desc: "Cupom de R$50", city: "Online", tag: "R$50" },
    { brand: "Farm Rio", desc: "10% em coleção", city: "Rio de Janeiro", tag: "10% off" },
    { brand: "Reserva Mini", desc: "20% para membros", city: "Brasil", tag: "20% off" },
  ]},
  "farmacia-e-saude": { name: "Farmácia e Saúde", img: catIconFarmacia, eyebrow: "Bem-estar", desc: "Medicamentos, perfumaria, suplementos e planos de saúde com vantagens reais.", items: [
    { brand: "Drogaria Royale", desc: "Até 30% em genéricos", city: "Brasil", tag: "30% off" },
    { brand: "Pague Menos Plus", desc: "Cashback 4%", city: "Brasil", tag: "4%" },
    { brand: "Raia Premium", desc: "Frete grátis", city: "Online", tag: "Frete" },
    { brand: "Drogasil Club", desc: "15% em perfumaria", city: "Brasil", tag: "15% off" },
    { brand: "Hapvida Saúde", desc: "Mensalidade com bolsa", city: "Brasil", tag: "Bolsa" },
    { brand: "Vitamine-se", desc: "10% em suplementos", city: "Online", tag: "10% off" },
  ]},
  "supermercado": { name: "Supermercado", img: catSupermercado, eyebrow: "Compra inteligente", desc: "Cashback e descontos nas maiores redes de supermercado do país.", items: [
    { brand: "Pão de Açúcar Mais", desc: "Cashback 3%", city: "Brasil", tag: "3%" },
    { brand: "Carrefour Club", desc: "5% em hortifruti", city: "Brasil", tag: "5% off" },
    { brand: "Extra Premium", desc: "Cupom de R$30", city: "Brasil", tag: "R$30" },
    { brand: "Assaí Atacadista", desc: "Frete grátis acima R$200", city: "Brasil", tag: "Frete" },
    { brand: "Sam's Club Royale", desc: "Anuidade com 20%", city: "Brasil", tag: "20% off" },
    { brand: "Mambo Delivery", desc: "10% para membros", city: "São Paulo", tag: "10% off" },
  ]},
  "tecnologia": { name: "Tecnologia", img: catTecnologia, eyebrow: "Royalle Tech", desc: "Smartphones, notebooks, gadgets e acessórios das melhores marcas globais.", items: [
    { brand: "Apple Authorized", desc: "Parcelamento sem juros", city: "Brasil", tag: "Parcelado" },
    { brand: "Samsung Members", desc: "Cashback 5%", city: "Online", tag: "5%" },
    { brand: "Dell Premier", desc: "Até 15% em notebooks", city: "Online", tag: "15% off" },
    { brand: "Kabum Plus", desc: "Cupom de R$200", city: "Online", tag: "R$200" },
    { brand: "Logitech Pro", desc: "10% em acessórios", city: "Online", tag: "10% off" },
    { brand: "Ponto Fino", desc: "2,5% cashback", city: "Online", tag: "2,5%" },
  ]},
  "casa-e-decoracao": { name: "Casa e Decoração", img: catCasaDec, eyebrow: "Lar premium", desc: "Móveis de design, decoração e tudo para transformar a sua casa em refúgio.", items: [
    { brand: "Tok&Stok Royale", desc: "Cashback 4%", city: "Online", tag: "4%" },
    { brand: "Westwing Home", desc: "Frete grátis Royalle", city: "Online", tag: "Frete" },
    { brand: "Etna Decora", desc: "15% de desconto", city: "Brasil", tag: "15% off" },
    { brand: "Camicado Plus", desc: "10% em utilidades", city: "Brasil", tag: "10% off" },
    { brand: "Leroy Merlin", desc: "Cupom de R$100", city: "Brasil", tag: "R$100" },
    { brand: "Oppa Design", desc: "20% em coleção", city: "Online", tag: "20% off" },
  ]},
  "viagens": { name: "Viagens", img: catViagens, eyebrow: "Royalle Travel", desc: "Passagens, hotéis, pacotes, cruzeiros e locação de veículos com cashback.", items: [
    { brand: "Decolar Premium", desc: "Cashback 5% em hotéis", city: "Online", tag: "5%" },
    { brand: "CVC Boutique", desc: "Até 12% em pacotes", city: "Brasil", tag: "12% off" },
    { brand: "Latam Pass", desc: "Pontos em dobro", city: "Brasil", tag: "2x pontos" },
    { brand: "Booking Royale", desc: "Cashback 4%", city: "Online", tag: "4%" },
    { brand: "Localiza Plus", desc: "20% em diárias", city: "Brasil", tag: "20% off" },
    { brand: "MSC Cruzeiros", desc: "Cabine upgrade", city: "Santos", tag: "Upgrade" },
  ]},
  "beleza": { name: "Beleza", img: catBeleza, eyebrow: "Royalle Glow", desc: "Cosméticos, perfumaria, skincare e serviços de estética premium.", items: [
    { brand: "Sephora Black", desc: "Cashback 6%", city: "Brasil", tag: "6%" },
    { brand: "O Boticário Club", desc: "20% para membros", city: "Brasil", tag: "20% off" },
    { brand: "Natura Verdê", desc: "15% em perfumaria", city: "Brasil", tag: "15% off" },
    { brand: "Avon Boutique", desc: "Até 40% off", city: "Online", tag: "40% off" },
    { brand: "MAC Cosmetics", desc: "Brinde Royalle", city: "Brasil", tag: "Brinde" },
    { brand: "L'Occitane", desc: "Frete grátis", city: "Brasil", tag: "Frete" },
  ]},
  "pet-shop": { name: "Pet Shop", img: catPetShop, eyebrow: "Royalle Pet", desc: "Rações premium, acessórios, banho, tosa e planos de saúde para o seu pet.", items: [
    { brand: "Petlove Royale", desc: "Cashback 6%", city: "Online", tag: "6%" },
    { brand: "Cobasi Premium", desc: "Frete grátis", city: "Online", tag: "Frete" },
    { brand: "Petz Plus", desc: "10% em ração", city: "Brasil", tag: "10% off" },
    { brand: "Beni Pet Store", desc: "15% em acessórios", city: "São Paulo", tag: "15% off" },
    { brand: "Pet Care Plan", desc: "Mensalidade 20% off", city: "Brasil", tag: "20% off" },
    { brand: "Banho & Tosa Lux", desc: "Cortesia spa pet", city: "São Paulo", tag: "Cortesia" },
  ]},
  "educacao": { name: "Educação", img: catEducacao, eyebrow: "Royalle Learn", desc: "Cursos, idiomas, MBAs, plataformas digitais e mentorias para evoluir.", items: [
    { brand: "Brasas English", desc: "Até 40% em cursos", city: "Online", tag: "40% off" },
    { brand: "Alura Premium", desc: "3 meses grátis", city: "Online", tag: "3 meses" },
    { brand: "FGV Executivo", desc: "MBA com bolsa", city: "Rio de Janeiro", tag: "Bolsa" },
    { brand: "Coursera Plus", desc: "Anuidade com desconto", city: "Online", tag: "Anuidade" },
    { brand: "Wise Up", desc: "30% em planos anuais", city: "Brasil", tag: "30% off" },
    { brand: "Descomplica Vest", desc: "50% no primeiro mês", city: "Online", tag: "50% off" },
  ]},
  "telecom": { name: "Telecom", img: catTelecom, eyebrow: "Conectividade", desc: "Planos de celular, internet fixa, fibra óptica e streaming com vantagens.", items: [
    { brand: "Vivo Valoriza", desc: "Bônus de dados", city: "Brasil", tag: "Bônus" },
    { brand: "Claro Clube", desc: "30% em planos", city: "Brasil", tag: "30% off" },
    { brand: "TIM Black", desc: "Streaming incluso", city: "Brasil", tag: "Streaming" },
    { brand: "Oi Fibra", desc: "Instalação grátis", city: "Brasil", tag: "Grátis" },
    { brand: "Net Premium", desc: "Combo com 20% off", city: "Brasil", tag: "20% off" },
    { brand: "Disney+ Royale", desc: "Anuidade com desconto", city: "Online", tag: "Anuidade" },
  ]},
  "financeiro": { name: "Financeiro", img: catFinanceiro, eyebrow: "Royalle Finance", desc: "Cartões, investimentos, seguros e serviços bancários com condições exclusivas.", items: [
    { brand: "Nubank Ultravioleta", desc: "Anuidade isenta", city: "Online", tag: "Isenção" },
    { brand: "C6 Black", desc: "Pontos em dobro", city: "Online", tag: "2x pontos" },
    { brand: "XP Investimentos", desc: "Assessoria grátis", city: "Brasil", tag: "Cortesia" },
    { brand: "Itaú Personnalité", desc: "Cashback em compras", city: "Brasil", tag: "Cashback" },
    { brand: "Porto Seguro Auto", desc: "10% no primeiro ano", city: "Brasil", tag: "10% off" },
    { brand: "Rico Investimentos", desc: "Taxa zero", city: "Online", tag: "Taxa zero" },
  ]},
  "automotivo": { name: "Automotivo", img: catAutomotivo, eyebrow: "Royalle Drive", desc: "Concessionárias, oficinas, estética automotiva, pneus e acessórios premium.", items: [
    { brand: "Mercedes-Benz Club", desc: "Revisão com bolsa", city: "Brasil", tag: "Bolsa" },
    { brand: "BMW Premium", desc: "Test drive privê", city: "Brasil", tag: "VIP" },
    { brand: "Boss Detail", desc: "15% em estética", city: "Brasília", tag: "15% off" },
    { brand: "Pirelli Plus", desc: "Cashback 5% em pneus", city: "Brasil", tag: "5%" },
    { brand: "Bosch Service", desc: "20% em revisão", city: "Brasil", tag: "20% off" },
    { brand: "Shell Box", desc: "Combustível com cashback", city: "Brasil", tag: "Cashback" },
  ]},
  "infantil": { name: "Infantil", img: catInfantil, eyebrow: "Royalle Kids", desc: "Tudo para crianças: roupas, brinquedos, escolas, festas e acessórios.", items: [
    { brand: "Ri Happy", desc: "15% em brinquedos", city: "Brasil", tag: "15% off" },
    { brand: "PBKids Plus", desc: "Cashback 4%", city: "Online", tag: "4%" },
    { brand: "Reserva Mini", desc: "20% em coleção", city: "Brasil", tag: "20% off" },
    { brand: "Hering Kids", desc: "Frete grátis", city: "Online", tag: "Frete" },
    { brand: "Pequenos Gênios", desc: "Matrícula com bolsa", city: "Brasil", tag: "Bolsa" },
    { brand: "Festa & Cia", desc: "10% em decoração", city: "São Paulo", tag: "10% off" },
  ]},
  "games-e-entretenimento": { name: "Games e Entretenimento", img: catGames, eyebrow: "Royalle Play", desc: "Consoles, jogos, streaming, eventos e tudo o que move o entretenimento.", items: [
    { brand: "PlayStation Plus", desc: "Anuidade com desconto", city: "Online", tag: "Anuidade" },
    { brand: "Xbox Game Pass", desc: "3 meses grátis", city: "Online", tag: "3 meses" },
    { brand: "Steam Royale", desc: "Cashback 5%", city: "Online", tag: "5%" },
    { brand: "Nintendo Store", desc: "10% em jogos", city: "Online", tag: "10% off" },
    { brand: "Sympla Plus", desc: "Cashback em shows", city: "Online", tag: "Cashback" },
    { brand: "Live Nation", desc: "Pré-venda Royalle", city: "Brasil", tag: "Pré-venda" },
  ]},
};

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    if (!CATEGORIES[params.slug]) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => {
    const cat = params ? CATEGORIES[params.slug] : undefined;
    return {
      meta: [
        { title: cat ? `${cat.name} — Royalle Club` : "Categoria — Royalle Club" },
        { name: "description", content: cat?.desc ?? "Categoria do clube Royalle." },
      ],
    };
  },
  notFoundComponent: () => (
    <SiteShell>
      <section className="py-24 text-center">
        <h1 className="font-display text-4xl text-[color:var(--midnight)]">Categoria não encontrada</h1>
        <Link to="/" className="mt-6 inline-block underline">Voltar para a home</Link>
      </section>
    </SiteShell>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = useParams({ from: "/categoria/$slug" });
  const cat = CATEGORIES[slug]!;
  return (
    <SiteShell>
      <section className="relative overflow-hidden bg-[color:var(--midnight)] text-[color:var(--ivory)]">
        <img src={cat.img} alt={cat.name} className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--midnight)] via-[color:var(--midnight)]/80 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="ornament" style={{ color: "var(--gold)" }}>{cat.eyebrow}</div>
          <h1 className="mt-4 max-w-2xl font-display text-5xl leading-tight md:text-6xl">{cat.name}</h1>
          <p className="mt-5 max-w-xl text-sm text-[color:var(--ivory)]/80 md:text-base">{cat.desc}</p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-center justify-between">
            <div className="ornament" style={{ color: "var(--gold-deep)" }}>{cat.items.length} parceiros</div>
            <Link to="/" className="text-xs uppercase tracking-[0.3em] text-[color:var(--gold-deep)] hover:text-[color:var(--midnight)]">← Voltar</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cat.items.map((b) => (
              <Link key={b.brand} to="/login" search={{ from: `/categoria/${slug}` }} className="luxe-card group flex flex-col p-7">
                <span className="inline-flex w-fit bg-[color:var(--midnight)] px-3 py-1 text-[0.6rem] uppercase tracking-[0.3em] text-[color:var(--gold)]">{b.tag}</span>
                <h3 className="mt-5 font-display text-2xl text-[color:var(--midnight)]">{b.brand}</h3>
                <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">{b.desc}</p>
                <div className="mt-6 flex items-center justify-between border-t border-dashed border-[color:var(--gold)]/40 pt-4">
                  <span className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--muted-foreground)]">
                    <MapPin className="h-3 w-3" /> {b.city}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[0.65rem] uppercase tracking-[0.25em] text-[color:var(--gold-deep)]">
                    Acessar <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

export const CATEGORY_SLUGS = Object.keys(CATEGORIES);
export { slugify };