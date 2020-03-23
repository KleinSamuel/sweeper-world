package de.sksdev.infiniteminesweeper.db.entities;

import javax.persistence.*;
import java.io.Serializable;



@Entity
@Table(name = "row_store")
@IdClass(RowStore.RowStoreId.class)
public class RowStore {

    class RowStoreId implements Serializable {
        private long x;
        private long y;
    }

    @Id
    private long x;

    @Id
    private long y;

    @OneToOne(mappedBy = "rows")
    @MapsId
    private Chunk chunk;


    @OneToOne(cascade = CascadeType.ALL)
    private Row r1;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r2;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r3;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r4;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r5;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r6;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r7;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r8;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r9;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r10;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r11;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r12;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r13;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r14;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r15;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r16;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r17;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r18;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r19;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r20;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r21;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r22;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r23;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r24;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r25;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r26;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r27;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r28;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r29;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r30;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r31;

    @OneToOne(cascade = CascadeType.ALL)
    private Row r32;


    public Chunk getChunk() {
        return chunk;
    }

    public void setChunk(Chunk chunk) {
        this.chunk = chunk;
    }

    public Row getR1() {
        return r1;
    }

    public void setR1(Row r1) {
        this.r1 = r1;
    }

    public Row getR2() {
        return r2;
    }

    public void setR2(Row r2) {
        this.r2 = r2;
    }

    public Row getR3() {
        return r3;
    }

    public void setR3(Row r3) {
        this.r3 = r3;
    }

    public Row getR4() {
        return r4;
    }

    public void setR4(Row r4) {
        this.r4 = r4;
    }

    public Row getR5() {
        return r5;
    }

    public void setR5(Row r5) {
        this.r5 = r5;
    }

    public Row getR6() {
        return r6;
    }

    public void setR6(Row r6) {
        this.r6 = r6;
    }

    public Row getR7() {
        return r7;
    }

    public void setR7(Row r7) {
        this.r7 = r7;
    }

    public Row getR8() {
        return r8;
    }

    public void setR8(Row r8) {
        this.r8 = r8;
    }

    public Row getR9() {
        return r9;
    }

    public void setR9(Row r9) {
        this.r9 = r9;
    }

    public Row getR10() {
        return r10;
    }

    public void setR10(Row r10) {
        this.r10 = r10;
    }

    public Row getR11() {
        return r11;
    }

    public void setR11(Row r11) {
        this.r11 = r11;
    }

    public Row getR12() {
        return r12;
    }

    public void setR12(Row r12) {
        this.r12 = r12;
    }

    public Row getR13() {
        return r13;
    }

    public void setR13(Row r13) {
        this.r13 = r13;
    }

    public Row getR14() {
        return r14;
    }

    public void setR14(Row r14) {
        this.r14 = r14;
    }

    public Row getR15() {
        return r15;
    }

    public void setR15(Row r15) {
        this.r15 = r15;
    }

    public Row getR16() {
        return r16;
    }

    public void setR16(Row r16) {
        this.r16 = r16;
    }

    public Row getR17() {
        return r17;
    }

    public void setR17(Row r17) {
        this.r17 = r17;
    }

    public Row getR18() {
        return r18;
    }

    public void setR18(Row r18) {
        this.r18 = r18;
    }

    public Row getR19() {
        return r19;
    }

    public void setR19(Row r19) {
        this.r19 = r19;
    }

    public Row getR20() {
        return r20;
    }

    public void setR20(Row r20) {
        this.r20 = r20;
    }

    public Row getR21() {
        return r21;
    }

    public void setR21(Row r21) {
        this.r21 = r21;
    }

    public Row getR22() {
        return r22;
    }

    public void setR22(Row r22) {
        this.r22 = r22;
    }

    public Row getR23() {
        return r23;
    }

    public void setR23(Row r23) {
        this.r23 = r23;
    }

    public Row getR24() {
        return r24;
    }

    public void setR24(Row r24) {
        this.r24 = r24;
    }

    public Row getR25() {
        return r25;
    }

    public void setR25(Row r25) {
        this.r25 = r25;
    }

    public Row getR26() {
        return r26;
    }

    public void setR26(Row r26) {
        this.r26 = r26;
    }

    public Row getR27() {
        return r27;
    }

    public void setR27(Row r27) {
        this.r27 = r27;
    }

    public Row getR28() {
        return r28;
    }

    public void setR28(Row r28) {
        this.r28 = r28;
    }

    public Row getR29() {
        return r29;
    }

    public void setR29(Row r29) {
        this.r29 = r29;
    }

    public Row getR30() {
        return r30;
    }

    public void setR30(Row r30) {
        this.r30 = r30;
    }

    public Row getR31() {
        return r31;
    }

    public void setR31(Row r31) {
        this.r31 = r31;
    }

    public Row getR32() {
        return r32;
    }

    public void setR32(Row r32) {
        this.r32 = r32;
    }
}
