package de.sksdev.infiniteminesweeper.db.entities;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "rows")
@IdClass(Row.RowId.class)
public class Row {

    public class RowId implements Serializable {
        private long x;
        private long y;
        private int y_tile;
    }

    @Id
    private long x;

    @Id
    private long y;

    @Id
    private int y_tile;

    @OneToOne
    @JoinColumns({
            @JoinColumn(name = "x", insertable = false,updatable = false),
            @JoinColumn(name = "y",insertable = false,updatable = false)
    })
    @MapsId
    private RowStore rowStore;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t1;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t2;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t3;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t4;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t5;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t6;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t7;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t8;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t9;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t10;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t11;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t12;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t13;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t14;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t15;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t16;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t17;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t18;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t19;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t20;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t21;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t22;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t23;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t24;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t25;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t26;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t27;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t28;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t29;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t30;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t31;

    @OneToOne(cascade = CascadeType.ALL)
    private Tile t32;


    public RowStore getRowStore() {
        return rowStore;
    }

    public void setRowStore(RowStore rowStore) {
        this.rowStore = rowStore;
    }

    public Tile getT1() {
        return t1;
    }

    public void setT1(Tile t1) {
        this.t1 = t1;
    }

    public Tile getT2() {
        return t2;
    }

    public void setT2(Tile t2) {
        this.t2 = t2;
    }

    public Tile getT3() {
        return t3;
    }

    public void setT3(Tile t3) {
        this.t3 = t3;
    }

    public Tile getT4() {
        return t4;
    }

    public void setT4(Tile t4) {
        this.t4 = t4;
    }

    public Tile getT5() {
        return t5;
    }

    public void setT5(Tile t5) {
        this.t5 = t5;
    }

    public Tile getT6() {
        return t6;
    }

    public void setT6(Tile t6) {
        this.t6 = t6;
    }

    public Tile getT7() {
        return t7;
    }

    public void setT7(Tile t7) {
        this.t7 = t7;
    }

    public Tile getT8() {
        return t8;
    }

    public void setT8(Tile t8) {
        this.t8 = t8;
    }

    public Tile getT9() {
        return t9;
    }

    public void setT9(Tile t9) {
        this.t9 = t9;
    }

    public Tile getT10() {
        return t10;
    }

    public void setT10(Tile t10) {
        this.t10 = t10;
    }

    public Tile getT11() {
        return t11;
    }

    public void setT11(Tile t11) {
        this.t11 = t11;
    }

    public Tile getT12() {
        return t12;
    }

    public void setT12(Tile t12) {
        this.t12 = t12;
    }

    public Tile getT13() {
        return t13;
    }

    public void setT13(Tile t13) {
        this.t13 = t13;
    }

    public Tile getT14() {
        return t14;
    }

    public void setT14(Tile t14) {
        this.t14 = t14;
    }

    public Tile getT15() {
        return t15;
    }

    public void setT15(Tile t15) {
        this.t15 = t15;
    }

    public Tile getT16() {
        return t16;
    }

    public void setT16(Tile t16) {
        this.t16 = t16;
    }

    public Tile getT17() {
        return t17;
    }

    public void setT17(Tile t17) {
        this.t17 = t17;
    }

    public Tile getT18() {
        return t18;
    }

    public void setT18(Tile t18) {
        this.t18 = t18;
    }

    public Tile getT19() {
        return t19;
    }

    public void setT19(Tile t19) {
        this.t19 = t19;
    }

    public Tile getT20() {
        return t20;
    }

    public void setT20(Tile t20) {
        this.t20 = t20;
    }

    public Tile getT21() {
        return t21;
    }

    public void setT21(Tile t21) {
        this.t21 = t21;
    }

    public Tile getT22() {
        return t22;
    }

    public void setT22(Tile t22) {
        this.t22 = t22;
    }

    public Tile getT23() {
        return t23;
    }

    public void setT23(Tile t23) {
        this.t23 = t23;
    }

    public Tile getT24() {
        return t24;
    }

    public void setT24(Tile t24) {
        this.t24 = t24;
    }

    public Tile getT25() {
        return t25;
    }

    public void setT25(Tile t25) {
        this.t25 = t25;
    }

    public Tile getT26() {
        return t26;
    }

    public void setT26(Tile t26) {
        this.t26 = t26;
    }

    public Tile getT27() {
        return t27;
    }

    public void setT27(Tile t27) {
        this.t27 = t27;
    }

    public Tile getT28() {
        return t28;
    }

    public void setT28(Tile t28) {
        this.t28 = t28;
    }

    public Tile getT29() {
        return t29;
    }

    public void setT29(Tile t29) {
        this.t29 = t29;
    }

    public Tile getT30() {
        return t30;
    }

    public void setT30(Tile t30) {
        this.t30 = t30;
    }

    public Tile getT31() {
        return t31;
    }

    public void setT31(Tile t31) {
        this.t31 = t31;
    }

    public Tile getT32() {
        return t32;
    }

    public void setT32(Tile t32) {
        this.t32 = t32;
    }
}
